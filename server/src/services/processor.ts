import Content from "../models/Content.js";
import { scrapeLink } from "../utils/scrape.js";
import { getEmbedding } from "../utils/embeddings.js";
import { qdrantClient } from "../utils/qDrant.js";

export const processCard = async (cardId: string, userId: string, title: string, link: string) => {
  try {
    console.log(`[process] Starting for card: ${cardId}`);

    const context = await scrapeLink(link);
    const embedding = await getEmbedding(`${title}\n${context}`);

    await qdrantClient.upsert("Card", {
      points: [
        {
          id: cardId,
          vector: embedding,
          payload: { cardId, userId, title, link },
        },
      ],
    });

    await Content.findOneAndUpdate({ cardId }, { status: "ready" });
    console.log(`[process] Completed for card: ${cardId}`);
  } catch (err) {
    console.error(`[process] Failed for ${cardId}`, err);
    await Content.findOneAndUpdate({ cardId }, { status: "failed" });
  }
};
