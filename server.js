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

// Brainrot Translator API Endpoints
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
                text: `Translate the following English text into authentic-sounding Gen Z 'brainrot' slang. The translation should be cringey, over-the-top, and use niche internet slang and emojis where appropriate. Aim for a tone that's both ironic and terminally online. Return ONLY the translated slang. Original text: "${text}"`,
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
                text: `Translate the following Gen Z 'brainrot' slang into clear, standard English. Explain any niche terms or emojis if necessary for clarity, but prioritize a concise and natural-sounding English translation. Return ONLY the translated English. Original slang: "${text}"`,
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

// Corporate BS Generator API endpoint
app.get("/api/corporate-bs", async (req, res) => {
  const { keywords } = req.query;
  const prompt = keywords
    ? `Generate a highly realistic and slightly absurd corporate buzzword phrase that incorporates these specific keywords: ${keywords}. The phrase should sound like it came from a marketing meeting trying too hard. Return ONLY the generated phrase, nothing else.`
    : "Generate a highly realistic and slightly absurd corporate buzzword phrase, packed with impressive-sounding but ultimately meaningless business jargon. It should sound like something a CEO would say in a confusing all-hands meeting. Return ONLY the generated phrase, nothing else.";

  try {
    console.log("Sending corporate-bs request to Gemini API");

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
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
      const corporatePhrase = extractGeminiResponseText(data);

      return res.json({
        corporatePhrase: corporatePhrase,
        keywords: keywords || null,
      });
    } catch (extractError) {
      console.error("Error extracting corporate BS:", extractError.message);
      return res.status(500).json({ error: extractError.message });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res.status(500).json({
      error: "Failed to generate corporate BS",
      details: error.message,
    });
  }
});

// Insult-to-Compliment Converter API endpoint
app.get("/api/insult-to-compliment", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    console.log(
      "Sending insult-to-compliment request to Gemini API for text:",
      text
    );

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Convert the following insult into a cuttingly passive-aggressive compliment. The compliment should sound superficially polite or even positive, but subtly retain the original insult's sting. It needs to be clever and make the recipient question if it was an insult or not. Return ONLY the passive-aggressive compliment. Original insult: "${text}"`,
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
      const compliment = extractGeminiResponseText(data);

      return res.json({
        insult: text,
        compliment: compliment,
      });
    } catch (extractError) {
      console.error("Error extracting compliment:", extractError.message);
      return res.status(500).json({ error: extractError.message });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to convert insult", details: error.message });
  }
});

// Polite but Brutal: Bad Review Generator API endpoint
app.get("/api/bad-review", async (req, res) => {
  const { style, subject, emotion } = req.query;

  let prompt = "Generate a polite but brutal bad review.";

  if (style) {
    prompt += ` The style should be ${style}.`;
  }
  if (subject) {
    prompt += ` The review is for a ${subject}.`;
  }
  if (emotion) {
    prompt += ` The underlying emotion should be ${emotion}.`;
  }

  prompt +=
    " The review should be awkwardly honest, painfully passive-aggressive, or darkly polite, not aggressively mean. Return ONLY the generated review text without any explanations, titles, or additional context.";

  // Add specific style instructions
  if (style === "Passive-Aggressive") {
    prompt +=
      " For example: 'Wow. Just wow. You really committed to making this the worst possible user experience. Inspiring, really.'";
  } else if (style === "Overly Polite") {
    prompt +=
      " For example: 'While I appreciate the bold attempt, I now have trust issues. Thank you for the character development.'";
  } else if (style === "Fake Enthusiasm") {
    prompt +=
      " For example: 'Best app ever! If your goal is to scream into a pillow after every click. 10/10 for emotional growth.'";
  } else if (style === "Existential Crisis") {
    prompt +=
      " For example: 'Tried this at 2am. Now I'm questioning my life choices and the state of modern UX design.'";
  } else if (style === "Haiku Mode") {
    prompt = `Generate a polite but brutal bad review in the form of a haiku (5-7-5 syllables).`;
    if (subject) prompt += ` The review is for a ${subject}.`;
    if (emotion) prompt += ` The emotion is ${emotion}.`;
    prompt +=
      " Return ONLY the haiku. For example:\nCrashed once, then again\nTook my hopes and dreams with it\nStill gave four stars";
  } else if (style === "Corporate Reviewer") {
    prompt +=
      " For example: 'From a business standpoint, this is... a choice. ROI is negative, but the audacity is priceless.'";
  }

  try {
    console.log(
      `Sending bad-review request to Gemini API with style: ${style}, subject: ${subject}, emotion: ${emotion}`
    );

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
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
      const review = extractGeminiResponseText(data);

      return res.json({
        review: review,
        style: style || null,
        subject: subject || null,
        emotion: emotion || null,
      });
    } catch (extractError) {
      console.error("Error extracting review:", extractError.message);
      return res.status(500).json({ error: extractError.message });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to generate bad review", details: error.message });
  }
});

// UwUify translator API endpoint
app.get("/api/uwuify", async (req, res) => {
  const { text } = req.query;

  if (!text) {
    return res.status(400).json({ error: "Missing text parameter" });
  }

  try {
    console.log("Sending uwuify request to Gemini API for text:", text);

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Translate the following text into 'uwu' speak. Make it sound extremely cute and 'cutesy,' using common uwu mannerisms like "sowwy," "pwease," adding stuttering (e.g., "h-hewwo"), and replacing 'l' and 'r' with 'w.' End with a cute kaomoji like (´｡• ᵕ •｡\`). Return ONLY the translated text. Original text: "${text}"`,
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
      const uwuText = extractGeminiResponseText(data);

      return res.json({
        original: text,
        uwu: uwuText,
      });
    } catch (extractError) {
      console.error("Error extracting uwu text:", extractError.message);
      return res.status(500).json({ error: extractError.message });
    }
  } catch (error) {
    console.error("Error with Gemini API:", error);
    return res
      .status(500)
      .json({ error: "Failed to uwuify text", details: error.message });
  }
});

// Serve the HTML pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/corporate-bs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "corporate-bs.html"));
});

app.get("/insult-to-compliment", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "insult-to-compliment.html"));
});

app.get("/bad-review", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bad-review.html"));
});

app.get("/uwuify", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "uwuify.html"));
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
