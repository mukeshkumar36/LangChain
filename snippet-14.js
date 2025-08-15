import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI model
import { PromptTemplate } from "@langchain/core/prompts"; // Import the ChatPrompt
import { z } from "zod";
import { LLMChain } from "langchain/chains";
import { EntityMemory } from "langchain/memory";
import { StructuredOutputParser } from "langchain/output_parsers"; // Import the output parser

// Model
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini", // Specify the model to use
  temperature: 0.7, // Set the temperature for randomness
  apiKey: process.env.OPENAI_API_KEY, // Use the API key from environment variables
});

//Parser
const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    response: z.string().describe("AI reply"),
    sentiment: z
      .enum(["positive", "neutral", "negative"])
      .describe("Sentiment of the reply"),
  })
);

// Prompt
const chatPrompt = new PromptTemplate({
  inputVariables: ["input", "history"],
  template: `History : {history}\nUser: {input}\nProvide a response in this format:\n
  ${parser.getFormatInstructions().replace(/{/g, "{{").replace(/}/g, "}}")}\n`,
});

//Memory
const memory = new EntityMemory({
  llm: chatModel,
});

// LLM Chain
const chatLLm = new LLMChain({
  llm: chatModel,
  prompt: chatPrompt,
  memory,
});

async function chatWithStructure(userInput) {
  const response = await chatLLm.call({ input: userInput });
  const parsedResponse = await parser.parse(response.text);
  console.log("Parsed Response:", parsedResponse);
  return parsedResponse;
}

(async () => {
  try {
    await chatWithStructure(
      "My name is Mukesh Kumar Dhiman. I am from India. I am feeling bad today !"
    );
    await chatWithStructure("Do you know my name ?");
    await chatWithStructure("Do you know where from I am ?");
    await chatWithStructure("What was my mood ?");
  } catch (error) {
    console.error("Error during chat:", error);
  }
})();
