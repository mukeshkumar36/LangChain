import "dotenv/config"; // Load environment variables
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { PromptTemplate } from "@langchain/core/prompts";
import { LLMChain } from "langchain/chains";

const chatModel = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

const promptTemplate = new PromptTemplate({
    inputVariables : ["playerName", "Year"],
    template: "Get the List of all country name in bullet format against which  cricket {playerName} player scored 100 run in a ODI match in the year {Year}."
});

const llmChains = new LLMChain({
    llm: chatModel,
    prompt: promptTemplate  
});


async function getCountryName(playerName, Year) {

    const result = await llmChains.call({ playerName, Year });
    console.log("Country Name:", result.text);
};

(async () => {
    try {
        const playerName = "Sachin Tendulkar";
        const Year = "2010";
        await getCountryName(playerName, Year);
    } catch (error) {
        console.error("Error:", error);
    }
})();