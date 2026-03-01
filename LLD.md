# Low-Level Design (LLD) - KalviumLabs Chatbot Agent

## 1. System Architecture
The application follows a client-server paradigm with an integrated AI Agent endpoint running through LangChain. 

### 1.1 Frontend (React SPA)
The frontend utilizes React states to mimic real-time database reactivity. The core layout sits inside `Dash.jsx`.
- `Cards.jsx`: Handles direct user manipulation of profile and application data using controlled forms.
- `Chatbot.jsx`: A floating widget component that acts as the user interface for the AI Agent. When the AI signals a systemic update, the Chatbot triggers `setStudentContextData()` passed down via props, instantly re-rendering `Dash.jsx` and `Cards.jsx` with newly modified SQLite data.

### 1.2 Backend API (Node + Express)
The backend hosts RESTful routes for standard GUI manipulation and a dedicated `/chat` endpoint for the Agent.
- **`studentController.js`**: Standard CRUD operations (`getProfile`, `updateProfile`, `deleteApplication`).
- **`agentController.js`**: Houses the `chatWithAgent` logic. Handles the intricate multi-turn tool calling loop for LangChain.

### 1.3 AI Agent Processing (LangChain + Groq)
- **Model**: `llama-3.1-8b-instant` through ChatGroq. Chosen for speed and strict JSON instruction adherence.
- **Paradigm**: Instead of relying on vulnerable SQL-generating Agents (which pose significant security flaws), the application uses **DynamicStructuredTools** and Zod schemas. This completely isolates the database layer from the LLM, creating a Zero-Trust bridge. By injecting `req.user.id` into the tool parameters on the server side, the LLM is impossible to jailbreak into querying other students' data.

## 2. Agent Workflow Loop
When `POST /api/students/chat` is hit with `{ message: "Update my city to Chennai" }`:

1. **Authentication:** `authMiddleware` verifies the JWT token and appends `req.user.id`.
2. **Tool Binding:** The controller instantiates `ChatGroq` and binds three strictly-typed tools: `getProfileTool`, `updateProfileTool`, and `deleteApplicationTool`.
3. **Execution Round 1:** 
   - The LLM receives the system prompt and the user message. 
   - Based on instructions, it detects a mutation and outputs a Tool Call request formatted for `updateProfileTool` with arguments: `{ city: "Chennai" }`.
4. **Tool Execution Engine:**
   - The Node.js loop parses the tool call.
   - It invokes `updateProfileTool` internally, validating the arguments against Zod.
   - The tool executes `studentModel.updateProfile(1, { city: "Chennai" })` strictly translating to SQLite parameterized safe queries.
5. **Execution Round 2:**
   - The confirmation string (`"Profile updated successfully..."`) is returned to the LLM.
   - The LLM processes this string and responds cleanly to the user in natural text: `"I've successfully updated your city to Chennai!"`
6. **Delivery:** The backend explicitly runs `studentModel.getFullProfile()` one final time, and returns both the LLM's text reply and the new Profile Object array back to the frontend.
