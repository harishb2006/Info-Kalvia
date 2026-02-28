import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite DB Path
// The db file is inside the 'db' folder under the 'server' root.
const dbPath = path.join(__dirname, "kalviumlabs_forge.sqlite");

if (!fs.existsSync(dbPath)) {
    console.error("❌ Database file not found at:", dbPath);
    process.exit(1);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ SQLite connection failed:", err.message);
        process.exit(1);
    }
    console.log("✅ Connected to EXISTING SQLite database in db/index.js");
});

// Helper functions to use Promises with sqlite3
const dbWrapper = {
    db,
    query: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
    get: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    },
    run: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }
};

export default dbWrapper;
