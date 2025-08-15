import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai"; // Import the ChatOpenAI
import { PromptTemplate } from "@langchain/core/prompts"; // Import the PromptTemplate class
import { LLMChain } from "langchain/chains"; // Import the LLMChain class
import { z } from "zod"; // Import zod for schema validation
import { StructuredOutputParser } from "langchain/output_parsers"; // Import the StructuredOutput

const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt1 = new PromptTemplate({
  inputVariables: ["actor", "year"],
  template:
    "List all movies award for {actor} in the {year} in the following format:",
});

const prompt = new PromptTemplate({
  inputVariables: ["actor", "year"],
  template: "List all movies award for {actor} in year {year} in the following format:",
});

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    awards: z.array(z.string()).describe("List of awards"),
  })
);

const chain = new LLMChain({
  llm: chatModel,
  prompt: prompt,
});

async function getAwardsDetails(actor, year) {
  const formatInstruction = parser
    .getFormatInstructions()
    .replace(/{/g, "{{")
    .replace(/}/g, "}}");
  const basePrompt = await prompt.format({ actor, year });
  const fullPrompt = `${basePrompt}\n\n${formatInstruction}`;
  console.log("Full Prompt:", fullPrompt);
  const llmChain = new LLMChain({
    llm: chatModel,
    prompt: new PromptTemplate({
      inputVariables: [],
      template: fullPrompt,
    }),
  });
  //   const response = await llmChain.invoke({ actor, year });

  const response = await llmChain.call({});

  const parsedResponse = await parser.parse(response.text);

  console.log("Response:", parsedResponse);
  return parsedResponse;
}

(async () => {
  try {
    const actor = "Amitabh Bacchan";
    const year = "2013";
    const awards = await getAwardsDetails(actor, year);
    console.log("Awards:", awards);
  } catch (error) {
    console.error("Error during processing:", error);
  }
})();
