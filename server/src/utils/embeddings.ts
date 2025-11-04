import axios from "axios";

export const getEmbedding = async(text:string):Promise<number[]> => {
    try {
        console.log('Generating embedding for: ');
        const response = await axios.post(
            'https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction',
            {inputs: text},
            {
                headers:{
                    'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                timeout:10000
            }
        );

        let embeddings = response.data;

        if(Array.isArray(embeddings[0])) {
            embeddings = embeddings[0];
        }

        console.log(`Embedding generated ${embeddings.length} dimensions`);
        
        return embeddings;
    }catch(err: any) {
       if (err.response?.status === 503) {
            console.log('Model is loading, waiting 5 seconds...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            return getEmbedding(text);
        }

        console.error('HuggingFace API error:', err.message);
        throw new Error('Failed to generate embedding');
    }
}