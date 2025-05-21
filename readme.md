# Brainrot ↔ English Translator

A web application that translates between standard English and Gen Z "brainrot" internet slang, with a clean and simple warm-beige UI.

## Features

- Translate English text to "brainrot" slang
- Translate "brainrot" slang back to standard English
- Simple, responsive UI with warm beige colors
- Fast API responses powered by Gemini AI

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/brainrot-translator.git
   cd brainrot-translator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

   You can get a Gemini API key from the [Google AI Studio](https://makersuite.google.com/app/apikey).

## Usage

1. Start the server:
   ```
   npm start
   ```
   For development with auto-restart:
   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. Type your text in the input field and click either:
   - "To Brainrot" to translate standard English to brainrot slang
   - "To English" to translate brainrot slang to standard English

## API Endpoints

You can also use the API directly:

- GET `/api/to-brainrot?text=Hello world`
  - Translates English text to brainrot slang
  - Returns: `{ "original": "Hello world", "brainrot": "..." }`

- GET `/api/to-english?text=no cap fr fr`
  - Translates brainrot slang to standard English
  - Returns: `{ "brainrot": "no cap fr fr", "translation": "..." }`

## Technologies Used

- Node.js
- Express.js
- Google Gemini AI API
- HTML/CSS/JavaScript

## License

MIT
# brainrot-translator
