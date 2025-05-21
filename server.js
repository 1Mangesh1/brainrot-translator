import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Configure environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Helper to extract text from Gemini response
const extractGeminiResponseText = (data) => {
  console.log("Full Gemini API response:", JSON.stringify(data, null, 2));

  let rawText = "";

  if (
    data.candidates &&
    data.candidates[0] &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts[0]
  ) {
    rawText = data.candidates[0].content.parts[0].text;
  } else if (data.error) {
    throw new Error(
      `Gemini API error: ${data.error.message || JSON.stringify(data.error)}`
    );
  } else {
    // Try different response formats
    if (data.text) rawText = data.text;
    if (data.content && data.content.parts && data.content.parts[0])
      rawText = data.content.parts[0].text;

    if (!rawText) {
      throw new Error(
        `Unexpected Gemini API response format: ${JSON.stringify(data)}`
      );
    }
  }

  // Extract just the translated text between the double asterisks
  // Example: **"This is the translated text"**
  const translationMatch = rawText.match(/\*\*["'](.+?)["']\*\*/);
  if (translationMatch && translationMatch[1]) {
    return translationMatch[1];
  }

  // If no match with the pattern above, try to find content between the first set of quotes
  const quotesMatch = rawText.match(/["'](.+?)["']/);
  if (quotesMatch && quotesMatch[1]) {
    return quotesMatch[1];
  }

  // If we couldn't extract with patterns, return the first line or the raw text
  const firstLine = rawText.split("\n")[0];
  if (firstLine && firstLine.length < rawText.length / 2) {
    return firstLine;
  }

  return rawText;
};

// API Endpoints
app.get("/api/to-brainrot", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    console.log("Sending to-brainrot request to Gemini API for text:", text);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate this English text to Gen Z brainrot slang. Return ONLY the translated text without explanations, markdown formatting, or additional context. Here's the text: "${text}"`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API HTTP error ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: `API returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();

    try {
      const translatedText = extractGeminiResponseText(data);

      return res.json({
        original: text,
        brainrot: translatedText,
      });
    } catch (extractError) {
      console.error("Error extracting translation:", extractError.message);
      return res.status(500).json({ error: extractError.message });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to translate text", details: error.message });
  }
});

app.get("/api/to-english", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    console.log("Sending to-english request to Gemini API for text:", text);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate this Gen Z brainrot slang to clear standard English. Return ONLY the translated text without explanations, markdown formatting, or additional context. Here's the text: "${text}"`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API HTTP error ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: `API returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();

    try {
      const translatedText = extractGeminiResponseText(data);

      return res.json({
        brainrot: text,
        translation: translatedText,
      });
    } catch (extractError) {
      console.error("Error extracting translation:", extractError.message);
      return res.status(500).json({ error: extractError.message });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to translate text", details: error.message });
  }
});

// Serve the HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Debug route to see Gemini API response structure
app.get("/api/debug", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${text}`,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API HTTP error ${response.status}:`, errorText);
      return res.status(response.status).json({
        error: `API returned ${response.status}`,
        details: errorText,
      });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to get API response", details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Gemini API URL: ${GEMINI_API_URL}`);
  console.log(`API key set: ${GEMINI_API_KEY ? "Yes" : "No"}`);
});
