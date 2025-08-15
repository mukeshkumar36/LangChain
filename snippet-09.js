import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { writeFileSync } from "fs";

writeFileSync(
  "sample.txt",
  "There is a session going on AI related stuff that helps to make the thing more facinating"
);

// Model
const chatModel = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt
const prompt = new PromptTemplate({
  inputVariables: ["txt"],
  template: "Summarize this : {txt} in atleast 100 words",
});

// Chains
const summaryChains = new LLMChain({
  llm: chatModel,
  prompt: prompt,
});

async function summarizeText(filePath) {
  const loader = new TextLoader(filePath);
  const docs = await loader.load();
  const text = docs[0].pageContent;
  const summary = await summaryChains.call({ txt: text });
  console.log("Summary:", summary.text);
  return summary.text;
}

(async () => {
  try {
    const summary = await summarizeText("sample.txt");
    console.log("Generated Summary:", summary);
  } catch (error) {
    console.error("Error during summarization:", error);
  }
})();
