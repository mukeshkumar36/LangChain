import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { PromptTemplate } from "@langchain/core/prompts"; // Import the PromptTemplate class
import { LLMChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Model
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt
const prompt = new PromptTemplate({
  inputVariables: ["chunk"],
  template: "Describe this : {chunk}",
});

// Splitter
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 50,
  chunkOverlap: 10,
});

// Chains
const chunkChain = new LLMChain({
  llm: chatModel,
  prompt: prompt,
});

async function processText(text) {
  const chunks = await textSplitter.splitText(text);
  console.log("Chunks:", chunks);
  for (const chunk of chunks) {
    const response = await chunkChain.call({ chunk: chunk });
    console.log(`Chunk : ${chunk} ---> Response: ${response.text}`);
    console.log("--------------------------------------------------");
  }
}


(async () => {
    try {
        const text = "LangChain is a framework for developing applications powered by language models. It provides modular components to build complex applications.";
        await processText(text);
    } catch (error) {
        console.error("Error during processing:", error);
    }
})();