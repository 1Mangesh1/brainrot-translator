document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const topicInput = document.getElementById("topicInput");
  const outputText = document.getElementById("outputText");
  const generateBtn = document.getElementById("generateBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Function to update status message
  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#cc3300" : "#a58390";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 4000);
  }

  // Function to generate insult
  async function generateInsult() {
    const topic = topicInput.value.trim();
    let apiUrl = "/api/shakespearean-insult";

    if (topic) {
      apiUrl += `?topic=${encodeURIComponent(topic)}`;
    }

    try {
      updateStatus("Conjuring a most grievous insult...");
      outputText.value = ""; // Clear previous output

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Set the generated insult to the output area
      outputText.value = data.insult;

      updateStatus("Thine insult is ready!");
    } catch (error) {
      console.error("Insult generation error:", error);
      updateStatus("Alas, a plague on this attempt! Pray, try again.", true);
    }
  }

  // Event listeners
  generateBtn.addEventListener("click", generateInsult);

  // Allow pressing Enter in the input to generate
  topicInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      generateBtn.click();
    }
  });
});
