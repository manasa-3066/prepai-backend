# PrepAI — Backend API

> Production-grade REST API for PrepAI, an AI-powered placement preparation platform built with Node.js, Express, MongoDB and Groq AI.

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database and schema modeling |
| JWT + bcryptjs | Authentication and password security |
| Groq AI (Llama 3.3) | Interview question generation and evaluation |
| @xenova/transformers | Local embedding model for RAG |
| pdf-parse + multer | PDF processing and file uploads |

## Features

- **JWT Authentication** — Register, login, protected routes
- **Mock Interview API** — Generate company-specific questions, evaluate answers, calculate scores
- **Skill Gap Analyser** — Parse resume PDF, compare with job description, generate learning roadmap
- **RAG Study Assistant** — Process PDF notes, create embeddings, answer questions using semantic search

## Architecture
src/
├── config/          # Database, CORS, multer configuration
├── controllers/     # Request handling and business logic
├── middlewares/     # JWT auth, error handling
├── models/          # Mongoose schemas (User, InterviewSession)
├── routes/          # API route definitions
├── services/        # Groq AI integration, RAG engine
└── utils/           # Async handler helper

## API Endpoints

### Authentication
POST /api/auth/register    Create new account
POST /api/auth/login       Login and receive JWT

### Mock Interview
POST /api/interview/start      Start a new interview session
POST /api/interview/evaluate   Submit and evaluate an answer
POST /api/interview/complete   Complete interview and get final report
GET  /api/interview/history    Get all past interview sessions
### Skill Gap
POST /api/skillgap/analyse    Upload resume PDF + job description
### Study Assistant (RAG)
POST   /api/chat/upload    Upload and index a PDF document
POST   /api/chat/ask       Ask a question about the document
DELETE /api/chat/clear     Clear the current document
## Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/manasa-3066/prepai-backend.git
cd prepai-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your values

# Start the server
npm start
```

### Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
```

## Key Technical Decisions

**Why MongoDB?**
Interview sessions have deeply nested data — questions, answers, scores, feedback all inside one session. MongoDB's document model fits this naturally without complex joins.

**Why JWT over sessions?**
PrepAI's API is stateless — the server never stores session data. JWT allows any server instance to verify a token without shared session storage, making it deployment-friendly.

**Why Groq over OpenAI?**
Groq provides 14,400 free requests per day with sub-second response times using open source Llama models. No billing setup required for development.

**Why local embeddings (@xenova/transformers)?**
Groq does not support embedding models. Running embeddings locally with the all-MiniLM-L6-v2 model eliminates API dependency, reduces latency, and keeps the RAG pipeline completely free.

## Author

**Manasa Kalavakolanu**
- GitHub: [@manasa-3066](https://github.com/manasa-3066)