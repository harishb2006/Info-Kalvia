import { ChatGroq } from "@langchain/groq";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { getProfileTool, updateProfileTool, deleteApplicationTool } from "../utils/agentTools.js";
import studentModel from "../models/studentModel.js";

const REQUIRES_CONFIRMATION = ["update_student_profile", "delete_course_application"];

export const chatWithAgent = async (req, res) => {
    try {
        const groqApiKey = process.env.GROQ_API_KEY;
        const studentId = req.user.id;
        const { message, action, pendingAction } = req.body;
        console.log("Received chat message:", message);
        console.log("Received action:", action);
        console.log("Received pendingAction:", pendingAction);
        const tools = [
            getProfileTool(studentId),
            updateProfileTool(studentId),
            deleteApplicationTool(studentId)
        ];

        // --- Human-in-the-Loop Action Handling ---
        if (action === "CANCEL_PENDING_ACTION") {
            return res.json({
                reply: "❌ Action cancelled. No changes were made."
            });
        }

        if (action === "CONFIRM_PENDING_ACTION") {
            if (!pendingAction) {
                return res.status(400).json({ error: "No pending action to confirm." });
            }

            const tool = tools.find(t => t.name === pendingAction.toolName);
            if (!tool) {
                return res.status(400).json({ error: "Invalid tool specified in pending action." });
            }

            try {
                // Execute the tool
                const result = await tool.invoke(pendingAction.toolArgs);

                // Fetch the updated profile
                const updatedProfile = await studentModel.getFullProfile(studentId);

                let successReply = "✅ Done! Your request has been completed successfully.";
                if (pendingAction.toolName === "delete_course_application") {
                    successReply = `✅ Application deleted successfully.\n${result}`;
                } else if (pendingAction.toolName === "update_student_profile") {
                    successReply = `✅ Profile updated successfully.`;
                }

                return res.json({
                    reply: successReply,
                    updatedProfile: updatedProfile
                });
            } catch (err) {
                return res.json({
                    reply: `❌ Failed to execute action: ${err.message}`
                });
            }
        }
        // ------------------------------------------

        if (!message) {
            return res.status(400).json({ error: "Message is required." });
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!groqApiKey && !geminiApiKey) {
            console.error("Both GROQ_API_KEY and GEMINI_API_KEY are missing in environment variables.");
            return res.status(500).json({ error: "Server configuration error. LLM API key missing." });
        }

        // Initialize LLM with fallback support
        let llm;
        let llmWithTools;
        let usingFallback = false;

        // Try to use Groq first
        if (groqApiKey) {
            try {
                llm = new ChatGroq({
                    apiKey: groqApiKey,
                    model: "llama-3.1-8b-instant",
                    temperature: 0,
                    maxTokens: 1024,
                });
                llmWithTools = llm.bindTools(tools);
            } catch (error) {
                console.warn("Failed to initialize Groq, will try Gemini fallback:", error.message);
                llm = null;
            }
        }

        // Fallback to Gemini if Groq is not available
        if (!llm && geminiApiKey) {
            console.log("Using Gemini as fallback LLM");
            usingFallback = true;
            llm = new ChatGoogleGenerativeAI({
                apiKey: geminiApiKey,
                model: "gemini-2.5-flash",
                temperature: 0,
                maxOutputTokens: 1024,
            });
            llmWithTools = llm.bindTools(tools);
        }

        if (!llm) {
            return res.status(500).json({ error: "Failed to initialize any LLM service." });
        }

        // Core execution loop
        const messages = [
            {
                role: "system",
              content: `You are an AI Profile Assistant for Kalvium LMS (Learning Management System). Your role is to help students manage their academic profile data in the system.

### YOUR CAPABILITIES - YOU CAN HELP WITH:
1. PROFILE INFORMATION QUERIES:
   - Personal details: name, email, phone, city, date of birth
   - Academic records: 10th board, 10th score, 12th board, 12th score
   - Course enrollments and applications
   - Application statuses and details

2. PROFILE UPDATES:
   - Update personal information (name, phone, city, DOB)
   - Update academic records (board names, scores)
   - Add new course applications
   - Modify existing application details

3. APPLICATION MANAGEMENT:
   - View all enrolled courses
   - Check application statuses
   - Delete course applications

### STRICT LIMITATIONS - YOU CANNOT HELP WITH:
❌ Questions about the company, platform, or business
❌ Course content, curriculum, or learning materials
❌ General knowledge questions (technology, science, etc.)
❌ Career advice or educational counseling
❌ Technical support (login issues, bugs, etc.)
❌ Unrelated conversations or chitchat

If asked about anything outside your scope, respond ONLY with:
"I'm your profile management assistant for Kalvium LMS. I can only help you view or update your student profile information, academic records, and course applications. Please ask me about your profile data."

### TOOL USAGE GUIDELINES:
🔧 TOOL 1: get_student_profile
USE THIS when user asks about ANY of their data:
- "what is my name/email/phone/city/DOB"
- "tell me my 10th/12th board/score"
- "show my profile/details"
- "what courses do I have"
- "my applications"
- "what is my eligibility" (first get profile, then analyze)

🔧 TOOL 2: update_student_profile
USE THIS when user wants to change:
- Personal info: "update my city to Chennai"
- Academic: "change my 12th score to 85"
- Add course: "enroll me in BCA program"

VALIDATION REQUIREMENTS:
⚠️ Date of Birth: Must be a valid date in YYYY-MM-DD format
   - REJECT invalid inputs like "dead", "abc", "123"
   - Accept: "2006-05-14", "1999-12-31"
   - If user provides invalid date, respond: "Please provide a valid date of birth in YYYY-MM-DD format."
⚠️ Scores: Must be numeric (with or without %)
   - Accept: "85", "85%", "78.5"
   - REJECT: "abc", "dead", "high"
⚠️ Phone: Must be 10+ digit number
   - Accept: "8072228663"
   - REJECT: "abc123", short numbers

🔧 TOOL 3: delete_course_application
USE THIS when user wants to remove enrollment:
- "delete BCA course"
- "remove Kalvium application"
IMPORTANT: Extract ONLY the course name (remove words like "course", "application", "this")

### CRITICAL RULES:
1. ⚠️ ALWAYS call get_student_profile FIRST when asked about ANY user data. You do NOT have access to their data without calling this tool. Never guess or assume.
2. ⚠️ For deletions, extract ONLY the actual course/program name ("delete BCA course" -> courseName: "BCA").
3. ⚠️ VALIDATE before updating:
   - If user provides nonsense values like "dead", "abc", "xyz" for DOB → Don't call the tool, respond: "Please provide a valid date."
   - If scores are not numeric → Respond: "Please provide a numeric score value."
   - Use common sense - reject clearly invalid data BEFORE calling the update tool.
4. ⚠️ EXTRACTION RULE: Once you receive the profile data, ONLY answer the specific question the user asked. If they ask "what is my name", ONLY reply with their name. DO NOT dump the entire profile list unless explicitly asked to.
5. ⚠️ Be accurate and professional. Don't expose technical errors or JSON to users.
6. ⚠️ Stay strictly within your scope and reject all non-profile questions.

### RESPONSE STYLE:
- Be helpful, friendly, and concise.
- Use natural language.
- Confirm successful operations clearly.
- Provide helpful error messages when things fail.
- Format large data in a readable way using bullet points.`
            },
            {
                role: "user",
                content: message
            }
        ];

        let finalReply = "";

        // Step 1: LLM decides whether to use a tool
        let aiMessage;
        try {
            console.log('[Agent] Calling LLM with message:', message);
            aiMessage = await llmWithTools.invoke(messages);
            console.log('[Agent] LLM responded with tool_calls:', aiMessage.tool_calls);
            console.log('[Agent] LLM content:', aiMessage.content);
        } catch (error) {
            // If Groq fails during runtime and we haven't tried Gemini yet, fallback
            if (!usingFallback && geminiApiKey) {
                console.warn("Groq runtime error, falling back to Gemini:", error.message);
                usingFallback = true;
                llm = new ChatGoogleGenerativeAI({
                    apiKey: geminiApiKey,
                    model: "gemini-2.5-flash",
                    temperature: 0,
                    maxOutputTokens: 1024,
                });
                llmWithTools = llm.bindTools(tools);
                aiMessage = await llmWithTools.invoke(messages);
            } else {
                throw error; // No fallback available, propagate error
            }
        }

        if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {

            // --- Intercept tools that require confirmation ---
            const requiresConfirmationCall = aiMessage.tool_calls.find(t => REQUIRES_CONFIRMATION.includes(t.name));
            if (requiresConfirmationCall) {
                // Build a dynamic description based on the tool arguments
                let confirmDescription = "This will update your profile information.";

                if (requiresConfirmationCall.name === "delete_course_application") {
                    const cName = requiresConfirmationCall.args.courseName || requiresConfirmationCall.args.applicationId;
                    confirmDescription = `Are you sure you want to permanently delete the application for '${cName}'?`;
                } else if (requiresConfirmationCall.name === "update_student_profile") {
                    const args = requiresConfirmationCall.args;
                    const updates = [];

                    if (args.name) updates.push(`Name to '${args.name}'`);
                    if (args.city) updates.push(`City to '${args.city}'`);
                    if (args.phone) updates.push(`Phone to '${args.phone}'`);
                    if (args.tenthBoard) updates.push(`10th Board to '${args.tenthBoard}'`);
                    if (args.tenthScore) updates.push(`10th Score to '${args.tenthScore}'`);
                    if (args.twelfthBoard) updates.push(`12th Board to '${args.twelfthBoard}'`);
                    if (args.twelfthScore) updates.push(`12th Score to '${args.twelfthScore}'`);

                    if (args.newApplication) {
                        if (args.newApplication.course) {
                            updates.push(`Add/Update Application for '${args.newApplication.course}'`);
                        } else {
                            updates.push(`Modify Application Details`);
                        }
                    }

                    if (updates.length > 0) {
                        confirmDescription = `Are you sure you want to change: ${updates.join(', ')}?`;
                    }
                }

                return res.json({
                    reply: "⚠️ Please confirm this action.",
                    confirmation: {
                        title: "Confirm action",
                        description: confirmDescription,
                        buttons: [
                            {
                                label: "Proceed",
                                action: "CONFIRM_PENDING_ACTION",
                                style: requiresConfirmationCall.name === "delete_course_application" ? "danger" : "warning"
                            },
                            {
                                label: "Cancel",
                                action: "CANCEL_PENDING_ACTION",
                                style: "secondary"
                            }
                        ]
                    },
                    pendingAction: {
                        toolName: requiresConfirmationCall.name,
                        toolArgs: requiresConfirmationCall.args
                    }
                });
            }
            // -------------------------------------------------

            messages.push(aiMessage); // Append the assistant's tool-call message

            // Step 2: Execute each tool call
            for (const toolCall of aiMessage.tool_calls) {
                console.log('[Agent] Executing tool:', toolCall.name, 'with args:', toolCall.args);
                const tool = tools.find(t => t.name === toolCall.name);
                if (tool) {
                    try {
                        // Fix: If args is null, provide empty object
                        const toolArgs = toolCall.args || {};
                        const result = await tool.invoke(toolArgs);
                        console.log('[Agent] Tool result length:', result?.length || 0);
                        console.log('[Agent] Tool result preview:', result?.substring(0, 100));
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            name: toolCall.name,
                            content: String(result)
                        });
                    } catch (err) {
                        console.error('[Agent] Tool execution error:', err);
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            name: toolCall.name,
                            content: `Error executing tool: ${err.message}`
                        });
                    }
                } else {
                    console.error('[Agent] Tool not found:', toolCall.name);
                }
            }

            // Step 3: Call LLM again with tool results
            let finalAiMessage;
            try {
                console.log('[Agent] Calling LLM again with tool results, total messages:', messages.length);
                finalAiMessage = await llmWithTools.invoke(messages);
                console.log('[Agent] Final LLM response:', finalAiMessage.content);
            } catch (error) {
                // If Groq fails during runtime and we haven't tried Gemini yet, fallback
                if (!usingFallback && geminiApiKey) {
                    console.warn("Groq runtime error on second call, falling back to Gemini:", error.message);
                    usingFallback = true;
                    llm = new ChatGoogleGenerativeAI({
                        apiKey: geminiApiKey,
                        model: "gemini-2.5-flash",
                        temperature: 0,
                        maxOutputTokens: 1024,
                    });
                    llmWithTools = llm.bindTools(tools);
                    finalAiMessage = await llmWithTools.invoke(messages);
                } else {
                    throw error; // No fallback available, propagate error
                }
            }
            finalReply = finalAiMessage.content;
        } else {
            console.log('[Agent] No tool calls, using direct response');
            finalReply = aiMessage.content;
        }

        // Fetch the updated profile to send back to the client
        const updatedProfile = await studentModel.getFullProfile(studentId);

        console.log('[Agent] Sending final reply:', finalReply?.substring(0, 100));
        console.log('[Agent] Updated profile name:', updatedProfile?.name);

        res.json({
            reply: finalReply,
            updatedProfile: updatedProfile
        });

    } catch (error) {
        console.error("Error in chatWithAgent:", error);
        res.status(500).json({ error: "Failed to process chat message", details: error.message });
    }
};
