import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { z } from "zod";
import { StructuredOutputParser } from "langchain/output_parsers";

// Model
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt
const prompt = new PromptTemplate({
  inputVariables: ["category"],
  template: "List 3 {category} items in the following format:",
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    items: z.array(z.string()).describe("List of items"),
  })
);


async function getParsedItems(category){

    // Get the Format instruction separatelly 
    const formatInstruction = parser.getFormatInstructions().replace(/{/g,'{{').replace(/}/g,'}}');

    // Format the base prompt and append the instructions
    const basePrompt = await prompt.format({ category });
    const fullPrompt = `${basePrompt}\n\n${formatInstruction}`;
    console.log("Full Prompt:", fullPrompt);

    // Call LLM with Full Prompt
    const chain = new LLMChain({
        llm: chatModel,
        prompt: new PromptTemplate({
            inputVariables: [],
            template: fullPrompt,
        }),
    });

   const response = await chain.call({}); 

   // Parse the LLM Response

   const parsedResponse = await parser.parse(response.text);
   console.log("Parsed Response:", parsedResponse); 
   return parsedResponse;
}


(async () => {
    try {
        const category = "Cricket";
        const items = await getParsedItems(category);
        console.log("Items:", items);
    } catch (error) {
        console.error("Error during processing:", error);
    }
})();