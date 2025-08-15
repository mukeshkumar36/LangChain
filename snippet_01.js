import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

async function main() {
  // Initialize LangChain's ChatOpenAI wrapper
  const chat = new ChatOpenAI({
    modelName: "gpt-4o-mini", 
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Create messages
  const messages = [
    new SystemMessage("You are a helpful assistant."),
    new HumanMessage("Hello! Can you tell me a fun fact about space?")
  ];

  // Send to model
  const response = await chat.invoke(messages);

  console.log("AI Response:", response.content);
}

main();
