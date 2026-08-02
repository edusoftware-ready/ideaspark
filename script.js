const topics = [
  "Global Distributed Microservices Engine",
  "High-Frequency Algorithmic Trading Pipeline",
  "Zero-Knowledge Proof Authentication Protocol",
  "AI-Powered Satellite Telemetry Analyzer",
  "Real-Time Multi-Region Database Sync Platform"
];

let timer = null;

async function runAutonomousTask() {
  const statusEl = document.getElementById("status");
  const outputEl = document.getElementById("output");
  
  // Pick a random seed topic
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  if (statusEl) statusEl.innerText = `[${new Date().toLocaleTimeString()}] Running automated loop for: ${randomTopic}...`;

  try {
    const res = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: randomTopic })
    });
    
    const data = await res.json();
    
    if (data.result && outputEl) {
      outputEl.innerText = data.result; // Displays the generated technical spec
    }
  } catch (err) {
    console.error("Loop error:", err);
  }
}

// Start autonomous execution when the page opens
window.addEventListener("DOMContentLoaded", () => {
  // Run once immediately
  runAutonomousTask();

  // Automatically repeat every 45 seconds (gives serverless functions time to execute)
  timer = setInterval(runAutonomousTask, 45000);
  
  // Stop automatically after 3 hours (10,800,000 milliseconds)
  setTimeout(() => {
    clearInterval(timer);
    alert("3-Hour Autonomous Token Run Completed!");
  }, 10800000);
});
