# KalviumLabs: Forge - AI Agent Chatbot

This repository contains the backend and frontend components for building an AI-powered agent chatbot capable of updating a user profile within an LMS application called "KalviumLabs: Forge". 

The application satisfies the core requirements of:
- A profile dashboard for managing personal details, education, and course applications manually.
- A fully integrated, real-time AI Agent widget capable of natural language queries using LangChain and Groq.
- Advanced Agentic capabilities (e.g. asking the AI "what is my tenth percentage?", "update my 12th board from TN HSC to KSEAB", or "delete my course application"). 
- Secure dynamic typed Tool-Calling using a local SQLite database, without exposing raw SQL directly to the LLM.

## Technologies Used
- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Node.js, Express, SQLite
- **AI/LLM:** `@langchain/groq`, `llama-3.1-8b-instant`, Zod (for strictly typed Tool-Calling APIs)

## Live Preview & Designs
- **Figma Design:** [Insert Link Here]
- **Deployed Application:** [Insert Link Here]

## Local Setup Instructions

### 1. Backend Setup
1. `cd server`
2. Run `npm install`
3. Copy `.env.example` to `.env` or create a `.env` file containing your API Key: `GROQ_API_KEY='your_groq_key_here'`
4. Start the backend: `node server.js`
The backend will run on `http://localhost:5000` and automatically connect to `server/db/kalvia.sqlite`.

### 2. Frontend Setup
1. Open a new terminal and `cd client`
2. Run `npm install`
3. Start the client: `npm run dev`
4. Access the application typically on `http://localhost:5173`

## Features Matrix
- [x] Login/Authentication Middleware
- [x] Manual Profile Updates
- [x] AI Chatbot Natural Language Queries (Retrieval)
- [x] AI Chatbot Natural Language Updates (Mutations)
- [x] AI Chatbot Application Deletion
- [x] Secure Contextual State Updates (Real-time reactivity in the parent UI)
