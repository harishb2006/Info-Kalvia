import { ChatGroq } from "@langchain/groq";
import { getProfileTool, updateProfileTool, deleteApplicationTool } from "../utils/agentTools.js";
import studentModel from "../models/studentModel.js";

export const chatWithAgent = async (req, res) => {
    try {
        const groqApiKey = process.env.GROQ_API_KEY;
        const studentId = req.user.id;
        const { message } = req.body;

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

        const tools = [
            getProfileTool(studentId),
            updateProfileTool(studentId),
            deleteApplicationTool(studentId)
        ];

        const llmWithTools = llm.bindTools(tools);

        // Core execution loop
        const messages = [
            {
                role: "system",
                content: `You are the KalviumLabs LMS Assistant. You directly access the SQLite database to help users.
CRITICAL RULES:
1. If the user asks ANY question about themselves (name, percentage, eligibility, status, etc.), YOU MUST CALL "get_student_profile" FIRST. DO NOT ask the user for their name, phone, or email to verify them. You already have secure access. Just call the tool with an empty query.
2. If the user asks you to update their application or data, call "update_student_profile".
3. If the user asks to delete an application, verify the ID using "get_student_profile" and then call "delete_course_application".
4. Answer concisely (e.g. "updated your 12th board from TN HSC to KSEAB successfully" or "your 10th percentage is 95%").
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
