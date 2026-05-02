import Content from "../models/Content.js";
import { scrapeLink } from "../utils/scrape.js";
import { getEmbedding } from "../utils/embeddings.js";
import { qdrantClient } from "../utils/qDrant.js";
import { sendSocketEvent } from "../utils/socketManager.js";

export const processCard = async (cardId: string, userId: string, title: string, link: string) => {
  try {
    console.log(`[process] Starting for card: ${cardId}`);

    sendSocketEvent(userId, "cardStatusUpdate", {
      cardId,
      title,
      status: "scraping",
      message: "Scraping content from the link...",
    });

    const context = await scrapeLink(link);

    sendSocketEvent(userId, "cardStatusUpdate", {
      cardId,
      title,
      status: "embedding",
      message: "Converting content to embeddings...",
    });

    const embedding = await getEmbedding(`${title}\n${context}`);

    sendSocketEvent(userId, "cardStatusUpdate", {
      cardId,
      title,
      status: "storing_qdrant",
      message: "Storing embeddings in Qdrant DB...",
    });

    await qdrantClient.upsert("Card", {
      points: [
        {
          id: cardId,
          vector: embedding,
          payload: { cardId, userId, title, link },
        },
      ],
    });

    sendSocketEvent(userId, "cardStatusUpdate", {
      cardId,
      title,
      status: "updating_mongo",
      message: "Updating card state in MongoDB...",
    });

    await Content.findOneAndUpdate({ cardId }, { status: "ready" });

    sendSocketEvent(userId, "cardProcessed", {
      cardId,
      title,
      message: "Card processing completed successfully!",
    });

    console.log(`[process] Completed for card: ${cardId}`);
  } catch (err) {
    console.error(`[process] Failed for ${cardId}`, err);
    await Content.findOneAndUpdate({ cardId }, { status: "failed" });

    const message = err instanceof Error ? err.message : String(err);
    sendSocketEvent(userId, "cardFailed", {
      title,
      cardId,
      error: message,
    });
  }
};
