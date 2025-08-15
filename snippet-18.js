import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini", // Specify the model to use
  temperature: 0.7, // Set the temperature for randomness
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from environment variables
});

const embeddings = new HuggingFaceInferenceEmbeddings({
  model: "sentence-transformers/all-MiniLM-L6-v2", // Free SBERT model
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

async function setupConversationalQAWithBufferMempry() {
  const documemnts = [
    "The Eiffel Tower is 324 meter tall.",
    "The Statue of Liberty is 93 meter tall.",
    "The Pyramid are ancient structure in Egypt.",
  ];

  // Create a Vectore Store

  const vectoreStore = await MemoryVectorStore.fromTexts(
    documemnts,
    [{ Id: 1 }, { Id: 2 }, { Id: 3 }],
    embeddings
  );

  let entityMemory;
  try {
    entityMemory = new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
    });
  } catch (error) {
    console.error("Error creating memory:", error);
  }

  const qaChain = ConversationalRetrievalQAChain.fromLLM(
    chatModel,
    vectoreStore.asRetriever(),
    { memory: entityMemory }
  );

  // Test the sequentail questions
  const question1 = "How big is Eiffle Tower ?";

  const result1 = await qaChain.call({ question: question1 });
  console.log(`Question 1 : ${question1}`);
  console.log("Answer 1 : ", result1.text);

  // Inspect the memory after Q1
  const memoryAfterQ1 = await entityMemory.loadMemoryVariables({});
  console.log("Memory after Question 1:", memoryAfterQ1);

    const question2 = "What about Statue of Liberty ?";
    const result2 = await qaChain.call({ question: question2 });
    console.log(`Question 2 : ${question2}`);
    console.log("Answer 2 : ", result2.text);

    // Inspect the memory after Q2
    const memoryAfterQ2 = await entityMemory.loadMemoryVariables({});
    console.log("Memory after Question 2:", memoryAfterQ2);

    const question3 = "Where are the Pyramids located ?";
    const result3 = await qaChain.call({ question: question3 });
    console.log(`Question 3 : ${question3}`);
    console.log("Answer 3 : ", result3.text);

    // Inspect the memory after Q3
    const memoryAfterQ3 = await entityMemory.loadMemoryVariables({});
    console.log("Memory after Question 3:", memoryAfterQ3);

}

(async () => {
  try {
    await setupConversationalQAWithBufferMempry();
  } catch (error) {
    console.error("Error:", error);
  }
})();
