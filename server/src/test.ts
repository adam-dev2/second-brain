import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: "https://afec67ea-7e83-4ede-b84d-3f5c5135acf0.europe-west3-0.gcp.cloud.qdrant.io", // or your Atlas-like Qdrant Cloud URL
  apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.wQcRRjt7_7ArFu-QjfKjU3Oyhd5xKzeUqMdfmjq7rzA", // only if you’re using Qdrant Cloud
});

async function updateUserId() {
  try {
    const collection = "Card";

    // First, find all points with the old userId
    const searchResult = await client.scroll(collection, {
      filter: {
        must: [
          {
            key: "userId",
            match: { value: "69009867277c5eda4fe927e2" }
          }
        ]
      },
      limit: 10000 // adjust as needed
    });

    const pointIds = searchResult.points.map(p => p.id);
    if (pointIds.length === 0) {
      console.log("No matching points found.");
      return;
    }

    console.log(`Found ${pointIds.length} points to update.`);

    // Update payload
    await client.setPayload(collection, {
      points: pointIds,
      payload: {
        userId: "69009d8b277c5eda4fe928a3"
      }
    });

    console.log("✅ Qdrant userId update completed.");
  } catch (err) {
    console.error("❌ Error updating Qdrant:", err);
  }
}

updateUserId();