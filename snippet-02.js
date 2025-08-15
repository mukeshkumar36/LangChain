import 'dotenv/config';
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage} from "@langchain/core/messages";


const chatModel = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.7,
    apiKey : process.env.OPENAI_API_KEY
});

const messages = [
    new SystemMessage("You are AI expert with Lang Chain framework and also Node JS expert."),
    new HumanMessage("I have want to know all bulding block of Lang Chain Framework.")
];

const response = await chatModel.invoke(messages);

console.log('OPENAI Response:', response.content);

