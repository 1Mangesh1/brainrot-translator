# AI Language Tools Suite

A collection of fun language tools powered by Gemini AI, with a clean and simple warm-beige UI.

## Tools Included

### 1. Brainrot ↔ English Translator
- Translate English text to Gen Z "brainrot" slang
- Translate "brainrot" slang back to standard English

### 2. Corporate BS Generator
- Generate professional-sounding corporate buzzword phrases
- Optionally include specific keywords in the generated phrases

### 3. Insult-to-Compliment Converter
- Transform insults into passive-aggressive compliments
- Keep the subtext while making it sound positive on the surface

## Features

- Simple, responsive UI with warm beige colors
- Fast API responses powered by Gemini AI
- Multiple tools sharing the same API key
- Clean, modern interface

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/ai-language-tools.git
   cd ai-language-tools
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

3. Use the navigation menu to switch between tools:
   - **Brainrot Translator**: Convert between standard English and Gen Z slang
   - **Corporate BS Generator**: Create buzzword-filled corporate phrases
   - **Insult-to-Compliment**: Transform insults into passive-aggressive compliments

## API Endpoints

You can also use the API directly:

### Brainrot Translator

- GET `/api/to-brainrot?text=Hello world`
  - Translates English text to brainrot slang
  - Returns: `{ "original": "Hello world", "brainrot": "..." }`

- GET `/api/to-english?text=no cap fr fr`
  - Translates brainrot slang to standard English
  - Returns: `{ "brainrot": "no cap fr fr", "translation": "..." }`

### Corporate BS Generator

- GET `/api/corporate-bs`
  - Generates a random corporate buzzword phrase
  - Returns: `{ "corporatePhrase": "..." }`

- GET `/api/corporate-bs?keywords=blockchain,metaverse`
  - Generates a corporate phrase including the specified keywords
  - Returns: `{ "corporatePhrase": "...", "keywords": "blockchain,metaverse" }`

### Insult-to-Compliment Converter

- GET `/api/insult-to-compliment?text=You're lazy`
  - Converts an insult into a passive-aggressive compliment
  - Returns: `{ "insult": "You're lazy", "compliment": "..." }`

## Examples

### Insult-to-Compliment Examples:
- "You're dumb" → "You have such a unique way of thinking—like nobody else would ever think that."
- "Your cooking is terrible" → "Your adventurous approach to flavors is certainly memorable!"

## Technologies Used

- Node.js
- Express.js
- Google Gemini AI API
- HTML/CSS/JavaScript

## License

MIT
