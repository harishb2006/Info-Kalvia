// server/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import dbWrapper from "./db/index.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import cors from "cors";

/* ---------------------------------------
   App Setup
---------------------------------------- */
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors()); // Allow cross-origin requests

/* ---------------------------------------
   Routes
---------------------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

/* ---------------------------------------
   ROOT
---------------------------------------- */
app.get("/", (req, res) => {
   res.json({ status: "Server running 🚀" });
});

/* ---------------------------------------
   SHOW ALL TABLES IN DB
---------------------------------------- */
app.get("/tables", async (req, res) => {
   const query = `
    SELECT name
    FROM sqlite_master
    WHERE type='table'
      AND name NOT LIKE 'sqlite_%'
  `;

   try {
      const rows = await dbWrapper.query(query);
      res.json({
         tableCount: rows.length,
         tables: rows.map(r => r.name),
      });
   } catch (err) {
      return res.status(500).json({ error: err.message });
   }
});

/* ---------------------------------------
   SELECT * FROM ANY TABLE
   Example: /table/users
---------------------------------------- */
app.get("/table/:tableName", async (req, res) => {
   const { tableName } = req.params;

   const query = `SELECT * FROM ${tableName}`;

   try {
      const rows = await dbWrapper.query(query);
      res.json({
         table: tableName,
         rowCount: rows.length,
         data: rows,
      });
   } catch (err) {
      return res.status(400).json({
         error: "Invalid table name or query failed",
         details: err.message,
      });
   }
});

/* ---------------------------------------
   Start Server
---------------------------------------- */
app.listen(PORT, () => {
   console.log(`🚀 Server listening on port ${PORT}`);
});