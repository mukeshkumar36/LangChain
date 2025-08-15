import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI model
import { HumanMessage, SystemMessage } from "@langchain/core/messages"; // Import message types
import { PromptTemplate } from "@langchain/core/prompts"; // Import the ChatPromptTemplate class
import { LLMChain } from "langchain/chains";

import { EntityMemory } from "langchain/memory";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.2,
  apiKey: process.env.OPENAI_API_KEY,
});

const chatPrompt = new PromptTemplate({
  inputVariables: ["input", "history"],
  template: "History: {history}\n\nUser: {input}\nAssistant:",
});

const memory = new EntityMemory({
  llm: chatModel,
});

const chatChain = new LLMChain({
  llm: chatModel,
  prompt: chatPrompt,
  memory: memory,
});

async function chatWithMemory(userInput) {
  const response = await chatChain.call({ input: userInput });
  console.log("AI Respponse:", response.text);

  return response.text;
}

(async () => {
  try {
    await chatWithMemory("Now I love Cooking");
    await chatWithMemory("What do I love to do?");
  } catch (error) {
    console.error("Error during chat:", error);
  }
})();
