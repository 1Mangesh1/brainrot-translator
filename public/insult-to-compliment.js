document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const convertBtn = document.getElementById("convertBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Function to update status message
  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#cc3300" : "#8c7d65";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 3000);
  }

  // Function to convert insult to compliment
  async function convertInsult() {
    const text = inputText.value.trim();

    if (!text) {
      updateStatus("Please enter an insult to convert!", true);
      return;
    }

    try {
      updateStatus("Converting...");
      outputText.value = ""; // Clear previous output

      const response = await fetch(
        `/api/insult-to-compliment?text=${encodeURIComponent(text)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Set the converted compliment to the output area
      outputText.value = data.compliment;

      updateStatus("Conversion complete!");
    } catch (error) {
      console.error("Conversion error:", error);
      updateStatus("Conversion failed. Please try again.", true);
    }
  }

  // Event listeners
  convertBtn.addEventListener("click", convertInsult);

  // Allow pressing Enter in textarea to convert
  inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      convertBtn.click();
    }
  });
});
