# 🎓 KalviumLabs: Forge - AI Agent Chatbot

> **An intelligent LMS profile management system powered by AI agents, built for seamless student profile updates through natural language conversation.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)](https://info-kalvia.vercel.app)
[![Backend on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://info-kalvia.onrender.com)
[![GitHub Copilot](https://img.shields.io/badge/AI_Assistant-GitHub_Copilot-181717?style=for-the-badge&logo=github)](https://github.com/features/copilot)

---

## 📋 Table of Contents
- [Overview](#-overview)
- [Live Demos](#-live-demos)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Setup Instructions](#-setup-instructions)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security Features](#-security-features)
- [AI Agent Details](#-ai-agent-details)

---

## 🌟 Overview

**KalviumLabs: Forge** is an AI-powered student profile management system that revolutionizes how students interact with their LMS profiles. Instead of navigating through complex forms, students can simply chat with an AI agent to update their information, check eligibility, and manage course applications.

### Key Highlights:
✅ **Natural Language Processing** - Update profiles by chatting naturally  
✅ **Real-time Updates** - Instant UI synchronization with database changes  
✅ **Secure Tool Calling** - Zero-SQL-injection architecture with Zod validation  
✅ **Dual LLM Fallback** - Groq (primary) → Gemini (fallback) for 100% uptime  
✅ **Cross-Origin Authentication** - JWT with Authorization headers for universal compatibility  
✅ **Human-in-the-Loop** - Confirmation dialogs for critical operations  

---

## 🚀 Live Demos

| Resource | Link |
|----------|------|
| 🌐 **Live Application** | [https://info-kalvia.vercel.app](https://info-kalvia.vercel.app) |
| 🔧 **Backend API** | [https://info-kalvia.onrender.com](https://info-kalvia.onrender.com) |
| 🎨 **Figma Design** | [Design Mockups](#) |
| 📊 **Database Schema** | [DrawSQL Diagram](https://drawsql.app/teams/kalviumlabs/diagrams/forge-march) |
| 📘 **Documentation** | [LLD.md](./LLD.md) |

---

## ✨ Features

### 🔐 Authentication System
- Email/Password registration and login
- JWT-based authentication with localStorage
- Authorization header for cross-origin compatibility
- Protected routes and middleware

### 👤 Profile Management
- **Personal Information**: Name, Email, Phone, DOB, City
- **Education Details**: 10th & 12th Board, Scores, Pass-out years
- **Course Applications**: Title, Duration, Fee, Status tracking
- Manual CRUD operations through intuitive UI
- Real-time form validation

### 🤖 AI Chatbot Agent
- **Natural Language Understanding**: 
  - "What is my tenth percentage?"
  - "Update my city to Bangalore"
  - "Add a new course application for Data Science"
  - "Delete my University of Mysore application"

- **Intelligent Features**:
  - Profile data retrieval
  - Dynamic profile updates
  - Application management
  - Eligibility checking
  - Confirmation dialogs for destructive operations

### 🔄 Real-time Synchronization
- Instant UI updates after chatbot interactions
- Bi-directional state management
- Optimistic UI updates
- Error handling and rollback

---

## 🛠 Technology Stack

### Frontend
```
React 18          - UI framework
Vite             - Build tool & dev server
TailwindCSS      - Utility-first styling
React Router     - Client-side routing
Fetch API        - HTTP requests
```

### Backend
```
Node.js          - JavaScript runtime
Express          - Web framework
SQLite3          - Database
JWT              - Authentication tokens
bcrypt           - Password hashing
cookie-parser    - Cookie handling
dotenv           - Environment configuration
```

### AI/ML Layer
```
LangChain        - Agent orchestration framework
@langchain/groq  - Primary LLM provider (Llama 3.1)
@langchain/google-genai - Fallback LLM (Gemini 2.5)
Zod              - Schema validation for tools
DynamicStructuredTool - Type-safe tool definitions
```

### DevOps
```
Vercel           - Frontend hosting
Render           - Backend hosting
GitHub           - Version control
GitHub Copilot   - AI code assistant
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Vercel)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  React SPA (info-kalvia.vercel.app)                   │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Login/     │  │  Dashboard   │  │   Chatbot    │ │  │
│  │  │   Signup     │  │   + Cards    │  │    Widget    │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │         │                  │                  │         │  │
│  │         └──────────────────┴──────────────────┘         │  │
│  │                     │ (Authorization: Bearer <token>)   │  │
│  └─────────────────────┼───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVER (Render)                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Express API (info-kalvia.onrender.com)              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │     Auth     │  │   Student    │  │    Agent     │ │  │
│  │  │  Controller  │  │  Controller  │  │  Controller  │ │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │  │
│  │         │                  │                  │         │  │
│  │         └──────────────────┴──────────────────┘         │  │
│  │                            │                             │  │
│  │              ┌─────────────┴─────────────┐              │  │
│  │              │   Auth Middleware         │              │  │
│  │              │   (JWT Verification)      │              │  │
│  │              └─────────────┬─────────────┘              │  │
│  │                            │                             │  │
│  │              ┌─────────────▼─────────────┐              │  │
│  │              │    Student Model          │              │  │
│  │              │  (Database Abstraction)   │              │  │
│  │              └─────────────┬─────────────┘              │  │
│  │                            │                             │  │
│  │              ┌─────────────▼─────────────┐              │  │
│  │              │   SQLite Database         │              │  │
│  │              │  • students               │              │  │
│  │              │  • education_details      │              │  │
│  │              │  • course_applications    │              │  │
│  │              └───────────────────────────┘              │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              AI AGENT LAYER                           │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │  LangChain Agent with Tool Calling               │ │  │
│  │  │                                                    │ │  │
│  │  │  Primary: Groq (llama-3.1-8b-instant)           │ │  │
│  │  │  Fallback: Gemini (gemini-2.5-flash)            │ │  │
│  │  │                                                    │ │  │
│  │  │  Tools:                                           │ │  │
│  │  │  ├─ getProfileTool (Zod validated)               │ │  │
│  │  │  ├─ updateProfileTool (Zod validated)            │ │  │
│  │  │  └─ deleteApplicationTool (Zod validated)        │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git
- (Optional) Groq API Key
- (Optional) Gemini API Key

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/harishb2006/Info-Kalvia.git
cd Info-Kalvia
```

### 2️⃣ Backend Setup
```bash
cd server
npm install

# Create .env file
cat > .env << EOL
NODE_ENV=development
GROQ_API_KEY='your_groq_api_key_here'
GEMINI_API_KEY='your_gemini_api_key_here'
JWT_SECRET='your_jwt_secret_here'
EOL

# Start the server
node server.js
# Server runs on http://localhost:5000
```

### 3️⃣ Frontend Setup
```bash
cd ../client
npm install

# Start development server
npm run dev
# Client runs on http://localhost:5173
```

### 4️⃣ Test the Application
1. Open browser to `http://localhost:5173`
2. Register a new account
3. Login with credentials
4. Try the chatbot: "What is my profile information?"
5. Update via chat: "Update my city to Mumbai"

---

## 📁 Project Structure

```
KalviumLabs/
├── client/                      # Frontend React Application
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Cards.jsx       # Profile cards with manual editing
│   │   │   ├── Chatbot.jsx     # AI chatbot widget
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── PublicRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Registration page
│   │   │   └── DashBoard.jsx   # Main dashboard
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── hooks/
│   │   │   └── useAuth.js      # Authentication hook
│   │   ├── App.jsx             # Root component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js Application
│   ├── controller/
│   │   ├── authController.js   # Login/Signup logic
│   │   ├── studentController.js # Profile CRUD
│   │   └── agentController.js   # AI agent endpoint
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   ├── models/
│   │   └── studentModel.js     # Database queries
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── studentRoutes.js    # Student endpoints
│   ├── utils/
│   │   └── agentTools.js       # LangChain tools
│   ├── db/
│   │   ├── index.js            # Database wrapper
│   │   └── kalviumlabs_forge.sqlite
│   ├── .env                    # Environment variables
│   ├── server.js               # Express server
│   └── package.json
│
├── README.md                    # This file
└── LLD.md                       # Low-Level Design document
```

---

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Stateless authentication with 7-day expiry
- **Password Hashing**: bcrypt with salt rounds = 10
- **Authorization Header**: Cross-origin compatible token transmission
- **HttpOnly Cookies**: Backup authentication method (fallback)

### Authorization
- **Middleware Protection**: All profile routes protected
- **User Scoping**: `req.user.id` injected from token
- **Zero-Trust Tools**: AI cannot access other users' data

### Data Validation
- **Zod Schemas**: Type-safe tool arguments
- **Input Sanitization**: SQL injection prevention
- **Parameterized Queries**: Safe database operations

### CORS Configuration
```javascript
origin: [
  "http://localhost:5173",
  "https://info-kalvia.vercel.app"
],
credentials: true
```

---

## 🤖 AI Agent Details

### LLM Strategy
- **Primary**: Groq with Llama 3.1 8B Instant
  - Ultra-fast inference
  - Reliable tool calling
  - Cost-effective

- **Fallback**: Google Gemini 2.5 Flash
  - Automatic failover on Groq errors
  - Three-tier fallback approach
  - 100% uptime guarantee

### Tool Architecture
```javascript
// Example: Get Profile Tool
{
  name: "get_student_profile",
  description: "Fetch complete student profile",
  schema: z.object({
    query: z.string().optional()
  }),
  func: async () => {
    return await studentModel.getFullProfile(studentId);
  }
}
```

### System Prompt
The agent is constrained to **only** handle profile management:
- ✅ View profile data
- ✅ Update profile fields
- ✅ Manage applications
- ❌ General knowledge questions
- ❌ Off-topic conversations

---

## 📊 Features Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| 🔐 Authentication | ✅ | JWT-based login/signup |
| 👤 Profile CRUD | ✅ | Manual profile editing |
| 🤖 AI Queries | ✅ | Natural language retrieval |
| ✏️ AI Updates | ✅ | Natural language mutations |
| 🗑️ AI Deletion | ✅ | Application removal via chat |
| ⚡ Real-time UI | ✅ | Instant state synchronization |
| 🔄 LLM Fallback | ✅ | Groq → Gemini failover |
| 🛡️ Security | ✅ | Zero-trust architecture |
| ⚠️ Confirmations | ✅ | Human-in-the-loop for critical ops |
| 🌐 Deployment | ✅ | Vercel + Render |

---

## 🎯 Future Enhancements
- [ ] Email verification
- [ ] Password reset flow
- [ ] File upload for documents
- [ ] Advanced course recommendations
- [ ] Multi-language support
- [ ] Voice chat interface
- [ ] Mobile application

---

## 👨‍💻 Development

### AI Code Assistant
This project was developed with **GitHub Copilot** assistance for:
- Code generation and completion
- Bug detection and fixes
- Documentation generation
- Code refactoring
- Test case suggestions

---

## 📄 License
This project is part of KalviumLabs Forge March 2026 challenge.

---

## 🙏 Acknowledgments
- **KalviumLabs** for the challenge and requirements
- **LangChain** for the agent framework
- **GitHub Copilot** for development assistance
- **Groq** & **Google** for LLM APIs

---

**Built with ❤️ by** [Harish](https://github.com/harishb2006)
