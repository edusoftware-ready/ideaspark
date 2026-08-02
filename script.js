document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");
  const promptInput = document.getElementById("promptInput");
  const outputEl = document.getElementById("output");
  const statusEl = document.getElementById("status");
  const modeSelect = document.getElementById("modeSelect");

  async function runManualTask() {
    const userPrompt = promptInput.value.trim();
    if (!userPrompt) {
      statusEl.innerText = "Please enter a prompt first.";
      return;
    }

    const currentMode = modeSelect ? modeSelect.value : "ascii";
    
    // UI Feedback
    generateBtn.disabled = true;
    generateBtn.innerText = "Generating...";
    if (statusEl) statusEl.innerText = `[Request Sent] Generating ${currentMode.toUpperCase()} for "${userPrompt}"...`;

    try {
      const res = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt, mode: currentMode })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `HTTP Error ${res.status}`);
      }

      if (data.result && outputEl) {
        if (statusEl) statusEl.innerText = `[Generation Successful]`;

        const entry = document.createElement("div");
        entry.style.borderTop = "2px solid #ccc";
        entry.style.marginTop = "20px";
        entry.style.paddingTop = "10px";

        // Display results, using pre-formatting for character art
        if (data.mode === "dalle") {
          // Use green monospace block for character "images"
          entry.innerHTML = `
            <h3>=== Generated CHARACTER ART (Monospace Grid) ===</h3>
            <pre style="font-family: monospace; font-size: 11px; line-height: 1; background: #000; color: #00ff00; padding: 15px; overflow-x: auto; border-radius: 6px; white-space: pre;">${data.result}</pre>
          `;
        } else {
          // Standard text output
          entry.innerHTML = `
            <h3>=== Generated TEXT ===</h3>
            <div>${data.result}</div>
          `;
        }

        outputEl.appendChild(entry);
      }
    } catch (err) {
      console.error("Manual Task Error:", err);
      if (statusEl) {
        statusEl.innerText = `[Generation Failed]: ${err.message}`;
      }
    } finally {
      generateBtn.disabled = false;
      generateBtn.innerText = "Generate";
    }
  }

  // Handle Generate Button Click
  generateBtn.addEventListener("click", runManualTask);
});
