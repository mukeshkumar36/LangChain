import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { HumanMessage } from "@langchain/core/messages";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";


const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini", // Specify the model to use
  temperature: 0.7, // Set the temperature for randomness
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from environment variables
});

// Define Embeddings
// const embeddings = new OpenAIEmbeddings({
//   model: "all-MiniLM-L6-v2", // Specify the embedding model
//   apiKey: process.env.HUGGINGFACE_API_KEY, // Use the API key from environment variables
// });
const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2", // Free SBERT model
  apiKey: process.env.HUGGINGFACE_API_KEY
});

async function compareTextSimilarity(text1, text2) {
  const [embedding1, embedding2] = await embeddings.embedDocuments([
    text1,
    text2,
  ]);

  console.log("Embedding 1 (First 5 values): --> ", embedding1.slice(0, 5));
  console.log("Embedding 2 (First 5 values): --> ", embedding2.slice(0, 5));

  // Calculate cosine similarity
  const similarity = cosinSimilarity(embedding1, embedding2);
  console.log(`Similarity between "${text1}" and "${text2}":`, similarity);

  // Interpret Similarity with LLM

  const interpretation = await chatModel.call([
    new HumanMessage(`Explain the similarity score ${similarity}`),
  ]);

  console.log("LLM Interpretation:", interpretation);
}

function cosinSimilarity(embedding1, embedding2) {
  const dotProduct = embedding1.reduce(
    (sum, val, i) => sum + val * embedding2[i],
    0
  );
  const norm1 = Math.sqrt(embedding1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(embedding2.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (norm1 * norm2);
}

(async () => {
  try {

    await compareTextSimilarity(
      "I love programming in JavaScript.",
      "JavaScript is my favorite programming language."
    );
    // await compareTextSimilarity(
    //   "The weather is nice today.",
    //   "It is a sunny day outside."
    // );
  } catch (error) {
    console.error("Error:", error);
  }
})();
