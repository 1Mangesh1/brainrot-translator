document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const toEnglishBtn = document.getElementById("toEnglishBtn");
  const toBrainrotBtn = document.getElementById("toBrainrotBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Function to update status message
  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#cc3300" : "#8c7d65";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 3000);
  }

  // Function to handle translation
  async function translate(endpoint) {
    const text = inputText.value.trim();

    if (!text) {
      updateStatus("Please enter some text to translate!", true);
      return;
    }

    try {
      updateStatus("Translating...");
      outputText.value = ""; // Clear previous output

      const response = await fetch(
        `/api/${endpoint}?text=${encodeURIComponent(text)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // Set the translated text to the output area
      outputText.value =
        endpoint === "to-brainrot" ? data.brainrot : data.translation;

      updateStatus("Translation complete!");
    } catch (error) {
      console.error("Translation error:", error);
      updateStatus("Translation failed. Please try again.", true);
    }
  }

  // Event listeners
  toBrainrotBtn.addEventListener("click", () => translate("to-brainrot"));
  toEnglishBtn.addEventListener("click", () => translate("to-english"));

  // Allow pressing Enter in textarea to translate
  inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      toBrainrotBtn.click(); // Default action is to translate to brainrot
    }
  });
});
