document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const inputText = document.getElementById("inputText");
  const outputText = document.getElementById("outputText");
  const uwuifyBtn = document.getElementById("uwuifyBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Function to update status message
  function updateStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "#cc3300" : "#a58390";
    setTimeout(() => {
      statusMessage.textContent = "";
    }, 3000);
  }

  // Function to handle translation
  async function uwuify() {
    const text = inputText.value.trim();

    if (!text) {
      updateStatus("Pwease entew some text to uwuify! >.<", true);
      return;
    }

    try {
      updateStatus("Uwuifying youw text...");
      outputText.value = ""; // Clear previous output

      const response = await fetch(
        `/api/uwuify?text=${encodeURIComponent(text)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ewwow ${response.status}`);
      }

      const data = await response.json();

      // Set the translated text to the output area
      outputText.value = data.uwu;

      updateStatus("Done! So cute! (´｡• ᵕ •｡`)");
    } catch (error) {
      console.error("Uwuify ewwow:", error);
      updateStatus("Oopsie woopsie! Faiwed to uwuify. Pwease twy again.", true);
    }
  }

  // Event listeners
  uwuifyBtn.addEventListener("click", uwuify);

  // Allow pressing Enter in textarea to translate
  inputText.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      uwuifyBtn.click();
    }
  });
});
