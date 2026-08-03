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
    const seedTopic = prompt || "Autonomous Enterprise Architecture System";

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an enterprise software architect. Provide an extremely verbose, comprehensive, and exhaustive technical analysis without shortening any descriptions or code snippets."
        },
        {
          role: "user",
          content: `Generate an exhaustive end-to-end technical system architecture, database design, API specification, and security audit blueprint for: ${seedTopic}.`
        }
      ],
      max_tokens: 2000,
    });

    const aiResponse = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: aiResponse }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
