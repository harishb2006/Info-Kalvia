// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

/* ---------------------------------------
   App Setup
---------------------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;

/* ---------------------------------------
   Global Middleware
---------------------------------------- */
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://info-kalvia.vercel.app",
    ],
  })
);

/* ---------------------------------------
   Routes
---------------------------------------- */
app.use("/api/auth", authRoutes);
// Apply auth middleware to all routes below
app.use("/api/students", studentRoutes);

/* ---------------------------------------
   Root / Health Check
---------------------------------------- */
app.get("/", (req, res) => {
  res.json({ status: "Server running 🚀" });
});

/* ---------------------------------------
   Start Server
---------------------------------------- */
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});