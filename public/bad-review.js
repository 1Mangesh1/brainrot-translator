document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const reviewStyleSelect = document.getElementById("reviewStyle");
  const reviewSubjectInput = document.getElementById("reviewSubject");
  const reviewEmotionInput = document.getElementById("reviewEmotion");
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

  // Function to generate bad review
  async function generateBadReview() {
    const style = reviewStyleSelect.value;
    const subject = reviewSubjectInput.value.trim();
    const emotion = reviewEmotionInput.value.trim();

    try {
      updateStatus("Generating review...");
      outputText.value = ""; // Clear previous output

      let apiUrl = "/api/bad-review?";
      const params = [];
      if (style) params.push(`style=${encodeURIComponent(style)}`);
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (emotion) params.push(`emotion=${encodeURIComponent(emotion)}`);
      apiUrl += params.join("&");

      const response = await fetch(apiUrl);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error ${response.status}: ${
            errorData.details || response.statusText
          }`
        );
      }

      const data = await response.json();

      outputText.value = data.review;

      updateStatus("Review generated successfully!");
    } catch (error) {
      console.error("Review generation error:", error);
      updateStatus(`Generation failed: ${error.message}`, true);
    }
  }

  // Event listeners
  generateBtn.addEventListener("click", generateBadReview);
});
