import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Hello! Can you tell me a fun fact about space?" }
      ],
    });

    console.log("AI Response:", completion.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
