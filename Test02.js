import OpenAI from "openai";

const openai = new OpenAI({
apikey:""
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Or "gpt-4o-mini" for cheaper/faster
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


// const response = openai.responses.create({
//   model: "gpt-4o-mini",
//   input: "write a haiku about ai",
//   store: true,
// });

// response.then((result) => console.log(result.output_text));