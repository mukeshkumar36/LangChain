import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { HumanMessage, SystemMessage } from "@langchain/core/messages"; // Import message types
import { PromptTemplate } from "@langchain/core/prompts"; // Import the PromptTemplate class
import { LLMChain } from "langchain/chains"; // Import the LLMChain class
import { Tool } from "@langchain/core/tools"; // Import the Tool class

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = new PromptTemplate({
  inputVariables: ["query"],
  template: "answer the query for : {query}",
});

class AddTool extends Tool {
  name = "AddTool";
  description = "A tool that adds two numbers";

  async _call(input) {
    const numbers = input.split(" ").map(Number);
    return numbers.reduce((a, b) => a + b, 0).toString();
  }
}

class MultiplyTool extends Tool {
  name = "MultiplyTool";
  description = "A tool that multiplies two numbers";

  async _call(input) {
    const numbers = input.split(" ").map(Number);
    return numbers.reduce((a, b) => a * b, 1).toString();
  }
}

async function useTool(query) {
  if (query.includes("add")) {
    const tool = new AddTool();
    const numbers = query.match(/\d+/g);
    if (numbers) {
      const result = await tool.call(numbers.join(" "));
      return `The sum of ${numbers.join(" and ")} is ${result}`;
    }
  } else if (query.includes("multiply")) {
    const tool = new MultiplyTool();
    const numbers = query.match(/\d+/g);
    if (numbers) {
      const result = await tool.call(numbers.join(" "));
      return `The multipication of ${numbers.join(" and ")} is ${result}`;
    }
  }
  const response = await llmChain.call({ query });
  return response.text;
}

const llmChain = new LLMChain({
  llm: chatModel,
  prompt: prompt,
});



(async () => {
  try {
    const result1 = await useTool("Please multiply 5 and 10.");
    console.log("Result 1:", result1);

    const result2 = await useTool("Tell me a joke.");
    console.log("Result 2:", result2);

    console.log();
    const result3 = await useTool("Please add 5 and 10.");
    console.log("Result 3:", result3);

  } catch (error) {
    console.error("Error during tool usage:", error);
  }
})();