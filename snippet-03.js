import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";

const chatModel = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const greetingTemplate = new PromptTemplate({
  inputVariables: ["name", "timeOfDay"],
  template: "Good {timeOfDay}, {name}! How can I assist you today?",
});

async function greetingMessage(name, timeOfDay) {
  const formattedPrompt = await greetingTemplate.format({ name, timeOfDay });
  console.log(`Formatted Prompt: ${formattedPrompt}`);
  const response = await chatModel.invoke([new HumanMessage(formattedPrompt)]);
  console.log("LLM Response:", response);
  return response;
}

async function run() {
  const name = "Alice";
  const timeOfDay = "morning";
  try {
    const response = await greetingMessage(name, timeOfDay);
    console.log("Greeting Response:", response.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

run();

// async function main() {
//   const name = "Alice";
//   const timeOfDay = "morning";

//   try {
//     const response = await greetingMessage(name, timeOfDay);
//     console.log("Greeting Response:", response.content);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
