import { ChatGroq } from "@langchain/groq";
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

        if (!groqApiKey) {
            console.error("GROQ_API_KEY is missing in environment variables.");
            return res.status(500).json({ error: "Server configuration error. LLM API key missing." });
        }

        const llm = new ChatGroq({
            apiKey: groqApiKey,
            model: "llama-3.1-8b-instant", // Fast and capable of tool calling
            temperature: 0,
            maxTokens: 1024,
        });

        const llmWithTools = llm.bindTools(tools);

        // Core execution loop
        const messages = [
            {
                role: "system",
                content: `You are the KalviumLabs LMS Assistant. You directly access the SQLite database to help users.
CRITICAL RULES:
1. If the user asks ANY question about themselves (name, percentage, eligibility, status, etc.), YOU MUST CALL "get_student_profile" FIRST. DO NOT ask the user for their name, phone, or email to verify them. You already have secure access. Just call the tool with an empty query.
2. If the user asks you to update their application or data, call "update_student_profile".
3. If the user asks to delete an application, call "delete_course_application" using the EXACT course name. DO NOT use IDs, and DO NOT guess the name. If you are unsure of the course name, call "get_student_profile" first to see their active applications.
4. Answer concisely (e.g. "updated your 12th board from TN HSC to KSEAB" or "your 10th percentage is 95%").
5. Do not expose json or technical error syntax to the user.`
            },
            {
                role: "user",
                content: message
            }
        ];

        let finalReply = "";

        // Step 1: LLM decides whether to use a tool
        const aiMessage = await llmWithTools.invoke(messages);

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
            const finalAiMessage = await llmWithTools.invoke(messages);
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
