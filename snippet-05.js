import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

const chatModel = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const storyPrompt = new PromptTemplate({
  inputVariables: ["title"],
  template: "Write a short story with the title: {title}.",
});

const storyChain = new LLMChain({
  llm: chatModel,
  prompt: storyPrompt,
});

async function generateStory(title) {
  const response = await storyChain.call({ title });
  console.log("Generated Story:", response.text);
  console.log("===============================================================================================");
  return response.text;
}

(async () => {
  try {
    const storyTitle = "The Lost kingdom";
    const story = await generateStory(storyTitle);
    console.log("Final Story:", story); 
  } catch (error) {
    console.error("Error generating story:", error);
  }
})();
