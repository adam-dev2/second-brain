import dotenv from "dotenv";
dotenv.config();

import { QdrantClient } from "@qdrant/js-client-rest";

export const VECTOR_SIZE = 384;
export const COLLECTION_NAME = "Card";

export const qdrantClient = new QdrantClient({
  url: 'https://afec67ea-7e83-4ede-b84d-3f5c5135acf0.europe-west3-0.gcp.cloud.qdrant.io',
  apiKey: process.env.QDRANT_API_KEY || "api-key",
});
