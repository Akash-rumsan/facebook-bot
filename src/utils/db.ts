import sqlite3 from "sqlite3";
import path from "path";
const dbPath = path.resolve(__dirname, "../../db/credentials.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS credentials (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_token TEXT NOT NULL UNIQUE,
  waba_id TEXT NOT NULL,
  phone_id TEXT NOT NULL UNIQUE,
  business_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
  (err) => {
    if (err) {
      console.error("Error creating credentials table:", err.message);
    } else {
      console.log("Credentials table created or already exists.");
    }
  }
);

export default db;
