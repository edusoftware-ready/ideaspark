const prompts = [
  "Futuristic cyberpunk cybernetic owl",
  "Retro arcade neon robot warrior",
  "Detailed mechanical dragon skull",
  "Steampunk airship flying through clouds",
  "Intricate geometric mandala pattern"
];

let runCount = 0;

async function runAutonomousTask() {
  const outputEl = document.getElementById("output");
  const statusEl = document.getElementById("status");
  const modeSelect = document.getElementById("modeSelect");
  
  const currentMode = modeSelect ? modeSelect.value : "ascii";
  runCount++;
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  if (statusEl) {
    statusEl.innerText = `[Batch #${runCount}] Generating ${currentMode.toUpperCase()} for: "${randomPrompt}"...`;
  }

  try {
    const res = await fetch("/.netlify/functions/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: randomPrompt, mode: currentMode })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `HTTP Error ${res.status}`);
    }

    if (data.result && outputEl) {
      const entry = document.createElement("div");
      entry.style.borderTop = "2px solid #333";
      entry.style.marginTop = "20px";
      entry.style.paddingTop = "10px";

      if (currentMode === "ascii") {
        entry.innerHTML = `
          <h3>=== BATCH #${runCount} (ASCII ART) ===</h3>
          <pre style="font-family: monospace; font-size: 11px; line-height: 1; background: #222; color: #00ff00; padding: 15px; overflow-x: auto; border-radius: 6px;">${data.result}</pre>
        `;
      } else {
        entry.innerHTML = `
          <h3>=== BATCH #${runCount} (DALL-E IMAGE) ===</h3>
          <div><img src="${data.result}" alt="Generated Image" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" /></div>
        `;
      }

      outputEl.insertBefore(entry, outputEl.firstChild);
    }
  } catch (err) {
    console.error("Batch Error:", err);
    if (statusEl) {
      statusEl.innerText = `[Batch #${runCount} Failed]: ${err.message}`;
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  runAutonomousTask();
  // Runs every 20 seconds to give Netlify function buffer time
  setInterval(runAutonomousTask, 20000);
});
