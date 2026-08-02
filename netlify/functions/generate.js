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
    const seedTopic = prompt || "Autonomous AI Logistics System";

    // Initialize conversation history
    let messages = [
      {
        role: "system",
        content:
          "You are an enterprise software architect. Provide exhaustive, highly detailed technical analysis without shortening your code or descriptions.",
      },
      {
        role: "user",
        content: `Create a complete technical blueprint for: ${seedTopic}. Include system architecture, database schema, and detailed security edge cases.`,
      },
    ];

    let fullReport = [];
    const MAX_LOOPS = 4; // Executes 4 deep reasoning iterations per button click

    for (let i = 1; i <= MAX_LOOPS; i++) {
      // Call OpenAI with high max_tokens to maximize throughput
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Uses gpt-4o for heavy token throughput
        messages: messages,
        max_tokens: 2500,
      });

      const aiResponse = response.choices[0].message.content;
      fullReport.push(`--- ITERATION ${i} ARCHITECTURE PHASE ---\n${aiResponse}`);

      // Push AI's response into context history so the NEXT call consumes all previous context tokens
      messages.push({ role: "assistant", content: aiResponse });

      // Prompt the model to critique its own work for the next loop
      if (i < MAX_LOOPS) {
        messages.push({
          role: "user",
          content: `Review the architecture above. Identify 5 complex performance bottlenecks and rewrite the spec to solve them with concrete code examples.`,
        });
      }
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result: fullReport.join("\n\n") }),
    };
  } catch (error) {
    console.error("Function Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
