import { QdrantClient } from "@qdrant/js-client-rest";

export const VECTOR_SIZE = 384;
export const COLLECTION_NAME = 'Card'

export const qdrantClient = new QdrantClient({
    url:process.env.QDRANT_URL || 'http://localhost:8080',
    apiKey:process.env.QDRANT_API_KEY || 'api-key'
})

