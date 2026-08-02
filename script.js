const topics = [
  "Global Distributed Microservices Engine",
  "High-Frequency Algorithmic Trading Pipeline",
  "Zero-Knowledge Proof Authentication Protocol",
  "AI-Powered Satellite Telemetry Analyzer",
  "Real-Time Multi-Region Database Sync Platform"
];

let runCount = 0;

async function runAutonomousTask() {
  const outputEl = document.getElementById("output") || document.body;
  
  runCount++;
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];

  console.log(`[Batch #${runCount}] Sending request for: ${randomTopic}`);

  try {
    const res = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: randomTopic })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP Error Status: ${res.status}`);
    }

    const data = await res.json();
    
    if (data.result) {
      // Formats the batch container HTML
      const formattedResult = `
        <div style="border-top: 2px solid #000; margin-top: 20px; padding-top: 10px;">
          <h3>=== BATCH #${runCount} (${new Date().toLocaleTimeString()}) ===</h3>
          <div>${data.result}</div>
        </div>
      `;

      // Appends HTML or image content directly into the DOM
      outputEl.innerHTML += formattedResult;
    }
  } catch (err) {
    console.error("Batch Error:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  runAutonomousTask();
  // Runs a new request every 15 seconds safely
  setInterval(runAutonomousTask, 15000);
});
