# Memorage

A full-stack language learning application that helps users create and practice word collections through exercises with AI-powered features.

## Features

- **Word Collections**: Create collections of word pairs (native/target language)
- **AI-Powered Import**: Extract words from images using Google Gemini
- **Practice Modes**: Flashcards and shuffle exercises
- **Translation**: Integrated Google Translate API
- **Text-to-Speech**: Pronunciation support via Google TTS
- **Multi-language UI**: Internationalization with i18next

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Shadcn UI (Radix)
- i18next

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication

### AI & APIs
- Google Gemini (image-to-word extraction)
- Google Translate API
- Google TTS API

## Getting Started

### Prerequisites
- Node.js
- MongoDB

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd memorage-app
```

2. Install dependencies
```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

3. Configure environment variables

**Server (.env)**
```
ATLAS_URI=<mongodb-connection-string>
PORT=<server-port>
TOKEN_KEY=<jwt-secret>
GEMINI_API_KEY=<google-gemini-api-key>
GOOGLE_TRANSLATE_API_KEY=<translation-api-key>
GOOGLE_TTS_API_KEY=<tts-api-key>
```

**Client (.env)**
```
VITE_API_URL=<backend-api-url>
```

### Running the Application

**Development**
```bash
# Start server (with auto-reload)
cd server
npm run dev

# Start client (with HMR)
cd client
npm run dev
```

**Production**
```bash
# Build client
cd client
npm run build

# Start server
cd server
npm start
```

## Project Structure

```
client/src/
├── pages/           # Route-based page components
│   ├── collection/  # Collection view + exercises, import
│   └── exercises/   # Flashcards and Shuffle
├── components/ui/   # Shadcn UI components
├── context/         # AuthContext
├── hooks/           # Custom hooks
└── api/config.js    # Axios instance with JWT interceptors

server/
├── controller/      # Business logic
├── models/          # Mongoose schemas
├── routes/          # Express routes
└── middleware/      # Auth middleware
```

## License

MIT
