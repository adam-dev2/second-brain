import { COLLECTION_NAME, qdrantClient, VECTOR_SIZE } from "../utils/qDrant.js";

export const ConnectQdrant = async() => {
    try{
        const collections = await qdrantClient.getCollections();
        console.log(collections);
        const exists = collections.collections.some((col) => {
            col.name === COLLECTION_NAME
        });
        console.log(exists);
        
        if(!exists) {
            console.log(`Collection ${COLLECTION_NAME} already exists`);
            return;
        }

        console.log(`Creating Collection: ${COLLECTION_NAME}`);
        await qdrantClient.createCollection(COLLECTION_NAME,{
            vectors:{
                size:VECTOR_SIZE,
                distance: 'Cosine'
            },
            optimizers_config:{
                default_segment_number: 2
            },
            replication_factor: 1
        })
        console.log('Collection created Successfully');
        
        await qdrantClient.createPayloadIndex(COLLECTION_NAME,{
            field_name: 'userId',
            field_schema: 'keyword'
        });

        await qdrantClient.createPayloadIndex(COLLECTION_NAME,{
            field_name: 'type',
            field_schema: 'keyword'
        });

        console.log('Payload indexes created');
        
    }catch(err: any) {
        console.log(err.message);
        throw err
    }
}
