import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { HumanMessage } from "@langchain/core/messages";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf"
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RetrievalQAChain } from "langchain/chains";

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
        "The Eiffel Tower is in Paris.",
        "The Statue of Liberty is in New York.",
        "The Pyramid are in Eqypt."
    ];

    // Create a Vectore Store

    const vectoreStore = await MemoryVectorStore.fromTexts(
        documemnts,
        [{ Id: 1},{ Id: 2},{ Id: 3},{ Id: 4}],
        embeddings
    );

    const qaChain = RetrievalQAChain.fromLLM(
        chatModel,
        vectoreStore.asRetriever()
    );

    //Query the Vectore Store
    const question = "I am planning to visit Paris. What should I see there?";

    const result = await qaChain.call({query:question});
    console.log(`Question: ${question}`);
    console.log("Answer : ", result.text);
}

(async () => {
    try {
        await setupVectoreStore();
    } catch (error) {
        console.error("Error:", error);
    }
})();

