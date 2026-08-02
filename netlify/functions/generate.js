const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt, mode } = JSON.parse(event.body || "{}");
    if (!prompt) throw new Error("No prompt provided.");

    console.log(`Processing [${mode.toUpperCase()}] request for prompt: ${prompt}`);

    // If generating an Image, we instruct GPT-4o to return heavy ASCII art.
    // This provides a high token consumption rate within the Netlify execution limit.
    const systemPrompt = (mode === "dalle")
      ? "You are an advanced AI generator. Create a detailed comparison table in Markdown format comparing X and Y."
      : "Generate a fully styled inline HTML <svg> element that draws a visual diagram of X.";

    // Both modes now use standard chat completions to stay under serverless timeouts
    const response = await openai.chat.completions.create({
      model: "gpt-4o", 
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Generate ${mode === 'dalle' ? 'ASCII art' : 'text'} for: ${prompt}`
        }
      ],
      max_tokens: 2000, // Keeps the output long to consume tokens
    });

    const aiResponse = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: aiResponse, mode: mode }),
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
