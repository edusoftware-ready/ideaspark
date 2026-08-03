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

  console.log(`[Batch #${runCount}] Request sent for: ${randomTopic}`);

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
      const entry = document.createElement("div");
      entry.style.borderTop = "2px solid #000";
      entry.style.marginTop = "20px";
      entry.style.paddingTop = "10px";
      entry.innerText = `=== BATCH #${runCount} (${new Date().toLocaleTimeString()}) ===\n\n${data.result}`;
      outputEl.appendChild(entry);
    }
  } catch (err) {
    console.error("Batch Error:", err);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  runAutonomousTask();
  // Fire a new request every 15 seconds
  setInterval(runAutonomousTask, 15000);
});
