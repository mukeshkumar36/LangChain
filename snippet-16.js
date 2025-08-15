import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { HumanMessage } from "@langchain/core/messages";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini", // Specify the model to use
  temperature: 0.7, // Set the temperature for randomness
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from environment variables
});

const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2", // Free SBERT model
  apiKey: process.env.HUGGINGFACE_API_KEY
});

async function setupVectoreStore() {
    const documemnts = [
        "The sky is blue and vast.",
        "The ocean is deep and mysterious.",
        "Mountains are tall and majestic.",
        "Forests are dense and full of life."
    ];

    // Create a Vectore Store

    const vectoreStore = await MemoryVectorStore.fromTexts(
        documemnts,
        [{ Id: 1},{ Id: 2},{ Id: 3},{ Id: 4}],
        embeddings
    );


    //Query the Vectore Store
    const query = "What is vast and blue?";

    const result = await vectoreStore.similaritySearch(query, 1);
    console.log("Most Similar document : ", result[0].pageContent);

    // Use LLM to interpret the result
    const response = await chatModel.call([
        new HumanMessage(`Based on this : "${result[0].pageContent}", answer : ${query}`)
    ]);

    console.log("LLM Response:", response);
}

(async () => {
    try {
        await setupVectoreStore();
    } catch (error) {
        console.error("Error:", error);
    }
})();

