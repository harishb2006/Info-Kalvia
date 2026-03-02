

#  KalviumLabs: Forge — AI Agent Chatbot

> **AI-powered LMS profile management system that lets students update and manage their profiles using natural language.**

 **Live App:** [https://info-kalvia.vercel.app](https://info-kalvia.vercel.app)
 **Backend API:** [https://info-kalvia.onrender.com](https://info-kalvia.onrender.com)
 **Figma Design:** [https://www.figma.com/design/Hb9BphGf0PYtSHI5lQrHal/Info-kalvia](https://www.figma.com/design/Hb9BphGf0PYtSHI5lQrHal/Info-kalvia)

---

##  Overview

**KalviumLabs: Forge** replaces traditional LMS forms with an **AI chatbot agent**.
Students can **view, update, and manage** their profile and course applications simply by chatting.

✔ Real-time updates
✔ Secure JWT authentication
✔ AI tool-based architecture (no direct DB access)
✔ Human-in-the-loop confirmations for critical actions
✔ Deployed and production-ready

---

##  Key Features

###  Authentication

* Email & password login/signup
* JWT-based auth using `Authorization` headers
* Protected routes & middleware

### 👤 Student Profile

* Personal details (name, phone, city, DOB)
* Education details (10th & 12th records)
* Course applications (status tracking)
* Manual CRUD via UI cards

### 🤖 AI Chatbot Agent

Supports natural language commands like:

* “What is my tenth percentage?”
* “Update my city to Bangalore”
* “Add a Data Science course”
* “Delete my course application” (with confirmation)

### ⚡ Real-Time Sync

* Instant UI updates after AI or manual changes
* Single source of truth from backend

---

## 🏗 High-Level Architecture

```
User (Browser)
     │
     ▼
React SPA (Vercel)
     │  JWT (Authorization Header)
     ▼
Express API (Render)
     │
     ├── Auth Middleware (JWT)
     ├── Student Controller
     └── AI Agent Controller
             │
             ▼
       LangChain Agent
       • Groq (Primary)
       • Gemini (Fallback)
       • Zod-validated Tools
             │
             ▼
        SQLite Database
```

---

## 🛠 Tech Stack

**Frontend**

* React 18, Vite, TailwindCSS
* React Router, Fetch API

**Backend**

* Node.js, Express
* SQLite, JWT, bcrypt

**AI Layer**

* LangChain
* Groq (Llama 3.1 8B) → Gemini 2.5 Flash (fallback)
* Zod for tool validation

**Deployment**

* Frontend: Vercel
* Backend: Render

---

##  Security Highlights

* JWT-based authentication (7-day expiry)
* User-scoped database access (`req.user.id`)
* Parameterized SQL queries
* Zero-trust AI (LLM can only call validated tools)
* Confirmation dialogs for destructive actions

---

##  Local Setup (Quick)

```bash
git clone https://github.com/harishb2006/Info-Kalvia.git
cd Info-Kalvia
```

### Backend

```bash
cd server
npm install
node server.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## Documentation

*  **Low-Level Design:** `LLD.md`
*  **Figma UI:**
  [https://www.figma.com/design/Hb9BphGf0PYtSHI5lQrHal/Info-kalvia](https://www.figma.com/design/Hb9BphGf0PYtSHI5lQrHal/Info-kalvia)

---

##  Future Enhancements

* Password reset & email verification
* Document uploads
* Course recommendations
* Multi-language support
* Voice-based chatbot

---

##  Author

**Harish**
GitHub: [https://github.com/harishb2006](https://github.com/harishb2006)

---
