const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { prompt } = JSON.parse(event.body || "{}");
    const seedTopic = prompt || "a futuristic cyberpunk city skyline";

    // Call OpenAI's DALL-E 3 image model
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: seedTopic,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;

    // Returns an HTML <img> tag pointing to the generated image URL
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: `<img src="${imageUrl}" style="max-width:100%; border-radius:8px;" />` }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
