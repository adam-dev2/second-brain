import { QdrantClient } from '@qdrant/js-client';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// 1. INITIALIZE QDRANT CLIENT
// ============================================

const qdrantClient = new QdrantClient({
    url: process.env.QDRANT_URL || 'http://localhost:6333',
    apiKey: process.env.QDRANT_API_KEY,  // Optional, for Qdrant Cloud
});

// If running Qdrant locally with Docker:
// docker run -p 6333:6333 qdrant/qdrant

// ============================================
// 2. COLLECTION SETUP
// ============================================

const COLLECTION_NAME = 'user_cards';
const VECTOR_SIZE = 384;  // For all-MiniLM-L6-v2 model

async function initializeCollection(): Promise<void> {
    try {
        // Check if collection exists
        const collections = await qdrantClient.getCollections();
        const exists = collections.collections.some(
            col => col.name === COLLECTION_NAME
        );

        if (exists) {
            console.log(`✅ Collection '${COLLECTION_NAME}' already exists`);
            return;
        }

        // Create collection
        console.log(`📦 Creating collection '${COLLECTION_NAME}'...`);
        await qdrantClient.createCollection(COLLECTION_NAME, {
            vectors: {
                size: VECTOR_SIZE,
                distance: 'Cosine',  // Cosine similarity
            },
            optimizers_config: {
                default_segment_number: 2,
            },
            replication_factor: 1,
        });

        console.log('✅ Collection created successfully');

        // Create payload indexes for faster filtering
        await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'userId',
            field_schema: 'keyword',
        });

        await qdrantClient.createPayloadIndex(COLLECTION_NAME, {
            field_name: 'type',
            field_schema: 'keyword',
        });

        console.log('✅ Payload indexes created');

    } catch (error: any) {
        console.error('❌ Error initializing collection:', error.message);
        throw error;
    }
}

// ============================================
// 3. GENERATE EMBEDDINGS FROM HUGGINGFACE
// ============================================

const HF_API_KEY = process.env.HF_API_KEY || 'your_hf_token_here';
const HF_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

async function getEmbedding(text: string): Promise<number[]> {
    try {
        console.log(`🔄 Generating embedding for: "${text.substring(0, 50)}..."`);

        const response = await axios.post(
            `https://api-inference.huggingface.co/pipeline/feature-extraction/${HF_MODEL}`,
            { inputs: text },
            {
                headers: {
                    'Authorization': `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            }
        );

        let embedding = response.data;

        // Handle nested array
        if (Array.isArray(embedding[0])) {
            embedding = embedding[0];
        }

        console.log(`✅ Embedding generated: ${embedding.length} dimensions`);
        return embedding;

    } catch (error: any) {
        if (error.response?.status === 503) {
            console.log('⏳ Model is loading, waiting 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return getEmbedding(text);
        }

        console.error('❌ HuggingFace API error:', error.message);
        throw new Error('Failed to generate embedding');
    }
}

// ============================================
// 4. STORE DATA IN QDRANT - SINGLE DOCUMENT
// ============================================

interface CardData {
    id: string;          // MongoDB _id as string
    userId: string;
    title: string;
    link: string;
    type: string;
    tags?: string[];
}

async function storeCardInQdrant(cardData: CardData): Promise<void> {
    try {
        console.log(`\n📝 Storing card: ${cardData.title}`);

        // Step 1: Generate embedding
        const embedding = await getEmbedding(cardData.title);

        // Step 2: Store in Qdrant
        await qdrantClient.upsert(COLLECTION_NAME, {
            wait: true,  // Wait for operation to complete
            points: [
                {
                    id: cardData.id,  // Use MongoDB _id as Qdrant point ID
                    vector: embedding,
                    payload: {
                        userId: cardData.userId,
                        title: cardData.title,
                        link: cardData.link,
                        type: cardData.type,
                        tags: cardData.tags || [],
                        createdAt: new Date().toISOString(),
                    },
                },
            ],
        });

        console.log(`✅ Card stored successfully with ID: ${cardData.id}`);

    } catch (error: any) {
        console.error('❌ Error storing card:', error.message);
        throw error;
    }
}

// ============================================
// 5. STORE MULTIPLE DOCUMENTS (BATCH)
// ============================================

async function storeMultipleCards(cards: CardData[]): Promise<void> {
    try {
        console.log(`\n📦 Storing ${cards.length} cards in batch...`);

        // Generate embeddings in parallel
        console.log('🔄 Generating embeddings...');
        const embeddings = await Promise.all(
            cards.map(card => getEmbedding(card.title))
        );
        console.log('✅ All embeddings generated');

        // Prepare points for batch insert
        const points = cards.map((card, index) => ({
            id: card.id,
            vector: embeddings[index],
            payload: {
                userId: card.userId,
                title: card.title,
                link: card.link,
                type: card.type,
                tags: card.tags || [],
                createdAt: new Date().toISOString(),
            },
        }));

        // Batch insert (Qdrant can handle large batches efficiently)
        await qdrantClient.upsert(COLLECTION_NAME, {
            wait: true,
            points: points,
        });

        console.log(`✅ Successfully stored ${cards.length} cards`);

    } catch (error: any) {
        console.error('❌ Error storing multiple cards:', error.message);
        throw error;
    }
}

// ============================================
// 6. UPDATE EXISTING DOCUMENT
// ============================================

async function updateCardInQdrant(
    cardId: string,
    newTitle: string,
    newMetadata?: Partial<CardData>
): Promise<void> {
    try {
        console.log(`\n🔄 Updating card: ${cardId}`);

        // Generate new embedding
        const newEmbedding = await getEmbedding(newTitle);

        // Get existing payload to merge
        const existingPoint = await qdrantClient.retrieve(COLLECTION_NAME, {
            ids: [cardId],
            with_payload: true,
        });

        if (existingPoint.length === 0) {
            throw new Error('Card not found in Qdrant');
        }

        const existingPayload = existingPoint[0].payload;

        // Update in Qdrant (upsert replaces the point)
        await qdrantClient.upsert(COLLECTION_NAME, {
            wait: true,
            points: [
                {
                    id: cardId,
                    vector: newEmbedding,
                    payload: {
                        ...existingPayload,
                        title: newTitle,
                        ...newMetadata,
                        updatedAt: new Date().toISOString(),
                    },
                },
            ],
        });

        console.log(`✅ Card updated successfully`);

    } catch (error: any) {
        console.error('❌ Error updating card:', error.message);
        throw error;
    }
}

// Alternative: Update only payload (without regenerating embedding)
async function updateCardPayloadOnly(
    cardId: string,
    updates: Record<string, any>
): Promise<void> {
    try {
        await qdrantClient.setPayload(COLLECTION_NAME, {
            wait: true,
            payload: {
                ...updates,
                updatedAt: new Date().toISOString(),
            },
            points: [cardId],
        });

        console.log(`✅ Payload updated for card: ${cardId}`);

    } catch (error: any) {
        console.error('❌ Error updating payload:', error.message);
        throw error;
    }
}

// ============================================
// 7. DELETE DOCUMENT
// ============================================

async function deleteCardFromQdrant(cardId: string): Promise<void> {
    try {
        console.log(`\n🗑️  Deleting card: ${cardId}`);

        await qdrantClient.delete(COLLECTION_NAME, {
            wait: true,
            points: [cardId],
        });

        console.log(`✅ Card deleted successfully`);

    } catch (error: any) {
        console.error('❌ Error deleting card:', error.message);
        throw error;
    }
}

// Delete by filter (e.g., all cards for a user)
async function deleteUserCards(userId: string): Promise<void> {
    try {
        console.log(`\n🗑️  Deleting all cards for user: ${userId}`);

        await qdrantClient.delete(COLLECTION_NAME, {
            wait: true,
            filter: {
                must: [
                    {
                        key: 'userId',
                        match: { value: userId },
                    },
                ],
            },
        });

        console.log(`✅ All user cards deleted`);

    } catch (error: any) {
        console.error('❌ Error deleting user cards:', error.message);
        throw error;
    }
}

// ============================================
// 8. CHECK IF DOCUMENT EXISTS
// ============================================

async function cardExistsInQdrant(cardId: string): Promise<boolean> {
    try {
        const result = await qdrantClient.retrieve(COLLECTION_NAME, {
            ids: [cardId],
        });

        return result.length > 0;

    } catch (error) {
        return false;
    }
}

// ============================================
// 9. GET DOCUMENT BY ID
// ============================================

async function getCardFromQdrant(cardId: string) {
    try {
        const result = await qdrantClient.retrieve(COLLECTION_NAME, {
            ids: [cardId],
            with_payload: true,
            with_vector: false,  // Set to true if you need the embedding
        });

        if (result.length === 0) {
            return null;
        }

        return {
            id: result[0].id,
            payload: result[0].payload,
        };

    } catch (error: any) {
        console.error('❌ Error getting card:', error.message);
        return null;
    }
}

// ============================================
// 10. GET ALL DOCUMENTS FOR A USER
// ============================================

async function getUserCards(userId: string, limit: number = 100) {
    try {
        const result = await qdrantClient.scroll(COLLECTION_NAME, {
            filter: {
                must: [
                    {
                        key: 'userId',
                        match: { value: userId },
                    },
                ],
            },
            limit: limit,
            with_payload: true,
            with_vector: false,
        });

        return result.points.map(point => ({
            id: point.id,
            payload: point.payload,
        }));

    } catch (error: any) {
        console.error('❌ Error getting user cards:', error.message);
        return [];
    }
}

// ============================================
// 11. SEARCH SIMILAR CARDS (SEMANTIC SEARCH)
// ============================================

async function searchSimilarCards(
    userId: string,
    query: string,
    limit: number = 10,
    scoreThreshold: number = 0.5  // Minimum similarity score
) {
    try {
        console.log(`\n🔍 Searching for: "${query}"`);

        // Generate query embedding
        const queryEmbedding = await getEmbedding(query);

        // Search in Qdrant
        const searchResult = await qdrantClient.search(COLLECTION_NAME, {
            vector: queryEmbedding,
            limit: limit,
            filter: {
                must: [
                    {
                        key: 'userId',
                        match: { value: userId },
                    },
                ],
            },
            with_payload: true,
            score_threshold: scoreThreshold,  // Only return results above this score
        });

        console.log(`✅ Found ${searchResult.length} similar cards`);

        return searchResult.map(result => ({
            id: result.id,
            score: result.score,  // Similarity score (0-1, higher is better)
            payload: result.payload,
        }));

    } catch (error: any) {
        console.error('❌ Error searching cards:', error.message);
        throw error;
    }
}

// ============================================
// 12. COUNT DOCUMENTS
// ============================================

async function countCards(userId?: string): Promise<number> {
    try {
        const filter = userId
            ? {
                  must: [
                      {
                          key: 'userId',
                          match: { value: userId },
                      },
                  ],
              }
            : undefined;

        const result = await qdrantClient.count(COLLECTION_NAME, {
            filter: filter,
            exact: true,
        });

        return result.count;

    } catch (error) {
        return 0;
    }
}

// ============================================
// 13. EXAMPLE USAGE
// ============================================

async function exampleUsage() {
    try {
        console.log('🚀 Starting Qdrant storage example...\n');

        // Initialize collection
        await initializeCollection();

        // Example 1: Store single card
        await storeCardInQdrant({
            id: 'card_123',
            userId: 'user_abc',
            title: 'Complete React Hooks Tutorial 2024',
            link: 'https://youtube.com/watch?v=xyz',
            type: 'video',
            tags: ['react', 'javascript', 'tutorial'],
        });

        // Example 2: Store multiple cards
        await storeMultipleCards([
            {
                id: 'card_456',
                userId: 'user_abc',
                title: 'TypeScript Best Practices',
                link: 'https://medium.com/typescript-tips',
                type: 'article',
                tags: ['typescript', 'programming'],
            },
            {
                id: 'card_789',
                userId: 'user_abc',
                title: 'Authentic Italian Pasta Recipe',
                link: 'https://cooking.com/pasta',
                type: 'article',
                tags: ['cooking', 'italian'],
            },
        ]);

        // Example 3: Search for similar cards
        const searchResults = await searchSimilarCards(
            'user_abc',
            'learning react hooks',
            5
        );
        console.log('\n🔍 Search results:', searchResults);

        // Example 4: Get card by ID
        const card = await getCardFromQdrant('card_123');
        console.log('\n📄 Retrieved card:', card);

        // Example 5: Update card
        await updateCardInQdrant(
            'card_123',
            'React Hooks Tutorial - Updated 2025',
            { type: 'tutorial' }
        );

        // Example 6: Count cards
        const userCardCount = await countCards('user_abc');
        console.log(`\n📊 User has ${userCardCount} cards`);

        // Example 7: Delete card
        await deleteCardFromQdrant('card_789');

        console.log('\n✅ All operations completed successfully!');

    } catch (error: any) {
        console.error('\n❌ Error in example:', error.message);
    }
}

// Run example
// exampleUsage();

// ============================================
// 14. EXPORT ALL FUNCTIONS
// ============================================

export {
    initializeCollection,
    getEmbedding,
    storeCardInQdrant,
    storeMultipleCards,
    updateCardInQdrant,
    updateCardPayloadOnly,
    deleteCardFromQdrant,
    deleteUserCards,
    cardExistsInQdrant,
    getCardFromQdrant,
    getUserCards,
    searchSimilarCards,
    countCards,
};