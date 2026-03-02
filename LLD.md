
---

# Info kalvia Chatbot Agent – Low-Level Design

## 1. System Overview

A secure, AI-powered student profile management system with **manual UI controls + conversational AI**, ensuring **real-time updates**, **strict data isolation**, and **LLM safety via tool-based access**.

### Core Capabilities

* Student authentication (JWT)
* Profile CRUD (personal, education, applications)
* AI agent for natural language profile updates
* Human-in-the-loop confirmation for destructive actions
* Real-time UI synchronization

---

## 2. High-Level Architecture

```
┌───────────────┐
│  React SPA    │
│ (Dashboard +  │
│  Chatbot UI)  │
└───────┬───────┘
        │ HTTPS (JWT)
        ▼
┌───────────────┐
│ Express API   │
│ • Auth        │
│ • Students    │
│ • AI Agent    │
└───────┬───────┘
        ▼
┌───────────────┐
│ AI Agent      │
│ • Tool-based  │
│ • Groq /      │
│   Gemini      │
└───────┬───────┘
        ▼
┌───────────────┐
│ SQLite DB     │
│ (Students,   │
│ Education,   │
│ Applications)│
└───────────────┘
```

---

## 3. Authentication & Authorization

### Authentication

* JWT-based authentication
* Token passed via `Authorization: Bearer <token>`
* 7-day expiry
* Cookie fallback for backward compatibility

### Authorization (Critical)

* Every request is scoped to `req.user.id`
* AI tools **cannot access other users**
* Database queries always include `student_id`

```
JWT → authMiddleware → req.user.id → Controllers / AI Tools
```

---

## 4. Database Design (Minimal)

```
students
└── id (PK)
└── full_name
└── email (unique)
└── password (hashed)
└── phone, city, dob

education_details
└── student_id (FK)
└── 10th / 12th board, score, year

course_applications
└── student_id (FK)
└── course_title
└── duration, fee, status
```

**Rules**

* `ON DELETE CASCADE` everywhere
* Parameterized SQL only
* No dynamic SQL from AI

---

## 5. API Surface (Essential)

### Auth

```
POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
```

### Student

```
GET    /api/students/profile
PUT    /api/students/profile
DELETE /api/students/profile/applications/:id
```

### AI Agent

```
POST /api/students/chat
```

---

## 6. AI Agent Design (Core Idea)

### Principles

* ❌ LLM never touches SQL
* ✅ LLM can only call predefined tools
* ✅ Tools are Zod-validated
* ✅ Tools are user-scoped

### Tool Set

```
get_student_profile(studentId)
update_student_profile(studentId, data)
delete_course_application(studentId, applicationId)
```

---

## 7. AI Execution Flow (User Update)

### Example: “Update my city to Delhi”

```
User Message
    │
    ▼
Auth Middleware (JWT)
    │
    ▼
Bind AI Tools (studentId injected)
    │
    ▼
LLM detects intent
    │
    ▼
Calls update_student_profile
    │
    ▼
DB updated (parameterized SQL)
    │
    ▼
LLM generates response
    │
    ▼
Updated profile sent to UI
```

---

## 8. Human-in-the-Loop Safety

### Destructive Actions (Delete)

```
User: "Delete my Data Science application"
        │
        ▼
Agent detects destructive intent
        │
        ▼
Returns confirmation payload
        │
        ▼
User clicks CONFIRM / CANCEL
        │
        ▼
Execute or abort tool
```

✔ Prevents accidental data loss
✔ Keeps AI non-autonomous for critical actions

---

## 9. Frontend Data Synchronization

```
AI / Manual Update
        │
        ▼
Backend returns updatedProfile
        │
        ▼
setStudentContextData(updatedProfile)
        │
        ▼
Dashboard + Cards re-render instantly
```

No refetch loops. No stale state.

---

## 10. LLM Fallback Strategy

```
Try Groq (Primary)
    │
    ├── Success → Continue
    │
    └── Failure
          ▼
       Gemini (Fallback)
```

Fallback happens:

* During initialization
* During runtime invocation
* After tool execution

---

## 11. Security Summary

### Backend

* JWT verification on all protected routes
* User-scoped DB queries
* SQL injection prevention (parameterized queries)

### AI Safety

* Zero-trust tool calling
* Strict system prompt
* No general knowledge / jailbreak scope

### Frontend

* Controlled forms
* Explicit confirmation for deletes
* Graceful error handling

---

## 12. Deployment (Minimal)

```
React SPA → Vercel
Express API → Render
SQLite → Persistent Disk
```

Environment variables:

```
JWT_SECRET
GROQ_API_KEY
GEMINI_API_KEY
```

---

## Final Notes

This design achieves:

* 🔒 Strong security boundaries
* 🤖 Safe and controllable AI behavior
* ⚡ Real-time UX
* 🧠 Clean separation of concerns
* 🚀 Production-ready architecture
