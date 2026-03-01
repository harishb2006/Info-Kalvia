import express from "express";
import { getProfile, updateProfile, deleteApplication } from "../controller/studentController.js";
import { chatWithAgent } from "../controller/agentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route to get student profile
router.get("/profile", authMiddleware, getProfile);

// Protected route to update student profile
router.put("/profile", authMiddleware, updateProfile);

// Protected route to delete an application
router.delete("/profile/applications/:applicationId", authMiddleware, deleteApplication);

// Protected route for LangChain Chatbot Agent
router.post("/chat", authMiddleware, chatWithAgent);

export default router;
