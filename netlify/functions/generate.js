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
    const userPrompt = prompt || "Cyberpunk Robot";

    // OPTION 2: REAL IMAGE GENERATION (Using current gpt-image-1-mini model)
    if (mode === "dalle") {
      const imageResponse = await openai.images.generate({
        model: "gpt-image-1-mini",
        prompt: userPrompt,
        n: 1,
        size: "256x256", // Fast resolution to avoid serverless timeouts
      });

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: imageResponse.data[0].url }),
      };
    }

    // OPTION 1: CHARACTER / ASCII ART (GPT-4o)
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ASCII artist. Generate high-detail ASCII art using mono-spaced text characters (#, @, *, +, -, /). Output ONLY the ASCII character block. Do not wrap in markdown code blocks."
        },
        {
          role: "user",
          content: `Create an ASCII art rendering of: ${userPrompt}`
        }
      ],
      max_tokens: 1000,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: chatResponse.choices[0].message.content }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
