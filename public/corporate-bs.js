document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const keywordsText = document.getElementById("keywordsText");
  const outputText = document.getElementById("outputText");
  const generateBtn = document.getElementById("generateBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Function to update status message
  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#cc3300" : "#8c7d65";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 3000);
  }

  // Function to generate corporate BS
  async function generateCorporateBS() {
    const keywords = keywordsText.value.trim();

    try {
      updateStatus("Generating...");
      outputText.value = ""; // Clear previous output

      // Build the request URL
      const url = keywords
        ? `/api/corporate-bs?keywords=${encodeURIComponent(keywords)}`
        : `/api/corporate-bs`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Set the corporate phrase to the output area
      outputText.value = data.corporatePhrase;

      updateStatus("Generated successfully!");
    } catch (error) {
      console.error("Generation error:", error);
      updateStatus("Generation failed. Please try again.", true);
    }
  }

  // Event listeners
  generateBtn.addEventListener("click", generateCorporateBS);

  // Allow pressing Enter in textarea to generate
  keywordsText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateBtn.click();
    }
  });
});
