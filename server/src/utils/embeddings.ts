import axios from "axios";

export const getEmbedding = async (text: string, attempt = 1): Promise<number[]> => {
  try {
    console.log("Generating embedding for: ");
    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2/pipeline/feature-extraction",
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    let embeddings = response.data;

    if (Array.isArray(embeddings[0])) {
      embeddings = embeddings[0];
    }

    console.log(`Embedding generated ${embeddings.length} dimensions`);

    return embeddings;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 503 && attempt < 3) {
        console.warn("Model is loading retrying in 5s");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return getEmbedding(text, attempt + 1);
      }

      console.error("Hugging Face API Error", {
        status,
        message: err.message,
        details: err.response?.data,
      });
    } else if (err instanceof Error) {
      console.error("Unexpected Error", err.message);
    } else {
      console.error("Uknown Error", err);
    }

    throw new Error("Failed to generate embedding");
  }
};
