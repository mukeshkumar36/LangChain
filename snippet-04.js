import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";

const chatModel = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const languageTemplate = new PromptTemplate({
  inputVariables: ["company"],
  template: "What all differnt LLM models released by {company}.",
});

async function languageMessage(company) {
  const formmatedPrompt = await languageTemplate.format({ company });
  console.log(`Formatted Prompt: ${formmatedPrompt}`);
  const response = await chatModel.invoke([new HumanMessage(formmatedPrompt)]);

  console.log("LLM Response:", response.content);
  return response;
}

(async () => {
  try {
    const response = await languageMessage("Google");
    console.log("Language Response:", response.content);
  } catch (error) {
    console.error("Error:", error);
  }
})();
