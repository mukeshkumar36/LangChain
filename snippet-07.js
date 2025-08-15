import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { Tool } from "@langchain/core/tools";

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = new PromptTemplate({
  inputVariables: ["query"],
  template: "answer the query: {query}",
});

class SquareTool extends Tool {
  name = "SquareTool";
  description = "A tool that squares a number";

  async _call(input) {
    const num = parseFloat(input);
    return (num * num).toString();
  }
}


class AddTool extends Tool {

    name = "AddTool";
    description = "A tool that adds two numbers";
    
    async _call(input) {
        const numbers = input.split(" ").map(Number);
        return numbers.reduce((a, b) => a + b, 0).toString();
    }
}


const llmChain = new LLMChain({
  llm: chatModel,
  prompt: prompt,
});

async function useTool(query) {
  
  if (query.includes("square")) {
    const tool = new SquareTool();
    const num = query.match(/\d+/)?.[0];
    const result = await tool.call(num);
    return `The square of ${num} is ${result}`;
  }
  if (query.includes("add")) {
    const tool = new AddTool();
    const numbers = query.match(/\d+/g);
    if (numbers) {
      const result = await tool.call(numbers.join(" "));
      return `The sum of ${numbers.join(" and ")} is ${result}`;
    }
  }
  const response = await llmChain.call({ query });
  return response.text;
}

(async () => {
  try {
    const result1 = await useTool("What is the square of 4?");
    console.log("Result 1:", result1);

    const result2 = await useTool("Tell me a joke.");
    console.log("Result 2:", result2);

    const result3 = await useTool("Please add 5 and 10.");
    console.log("Result 3:", result3);

  } catch (error) {
    console.error("Error during tool usage:", error);
  }
})();