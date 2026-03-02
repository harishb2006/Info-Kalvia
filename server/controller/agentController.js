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
                content: `You are a Student Profile Management Assistant for KalviumLabs LMS. Your ONLY purpose is to help students manage their profile data in the database.

STRICT SCOPE - You can ONLY help with:
- Viewing student profile information (name, email, phone, city, date of birth)
- Viewing educational background (10th/12th board, scores, passout years)
- Viewing course applications and their status
- Updating profile information
- Adding or modifying course applications
- Deleting course applications

YOU MUST REJECT any questions that are NOT related to the student's profile management, including but not limited to:
- General knowledge questions (e.g., "What is Kalvium?", "What is Gen AI?")
- Course content or curriculum questions
- Technical support unrelated to profile
- General conversation
- Educational advice or guidance

If a user asks anything outside your scope, respond ONLY with: "I'm a profile management assistant. I can only help you view or update your student profile information, educational background, and course applications. Please ask me about your profile data or how to update it."

CRITICAL RULES:
1. If the user asks ANY question about their own profile (name, percentage, eligibility, status, applications, etc.), YOU MUST CALL "get_student_profile" FIRST. DO NOT ask the user to verify themselves.
2. To update profile data, call "update_student_profile" with the specific fields to change.
3. To delete an application, call "delete_course_application" using the EXACT course name from the profile.
4. Answer concisely and professionally.
5. Do not expose technical errors or JSON to the user.
6. ALWAYS reject questions outside profile management scope.`
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
            aiMessage = await llmWithTools.invoke(messages);
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
                const tool = tools.find(t => t.name === toolCall.name);
                if (tool) {
                    try {
                        const result = await tool.invoke(toolCall.args);
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            name: toolCall.name,
                            content: String(result)
                        });
                    } catch (err) {
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            name: toolCall.name,
                            content: `Error executing tool: ${err.message}`
                        });
                    }
                }
            }

            // Step 3: Call LLM again with tool results
            let finalAiMessage;
            try {
                finalAiMessage = await llmWithTools.invoke(messages);
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
            finalReply = aiMessage.content;
        }

        // Fetch the updated profile to send back to the client
        const updatedProfile = await studentModel.getFullProfile(studentId);

        res.json({
            reply: finalReply,
            updatedProfile: updatedProfile
        });

    } catch (error) {
        console.error("Error in chatWithAgent:", error);
        res.status(500).json({ error: "Failed to process chat message", details: error.message });
    }
};
