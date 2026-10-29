const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const VERSION = process.env.APP_VERSION || "dev";

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: VERSION });
});

app.get("/notes", async (req, res) => {
  const result = await db.query("SELECT * FROM notes ORDER BY id");
  res.json(result.rows);
});

app.post("/notes", async (req, res) => {
  const result = await db.query(
    "INSERT INTO notes (text) VALUES ($1) RETURNING *",
    [req.body.text]
  );
  res.status(201).json(result.rows[0]);
});

app.listen(3000, () => console.log(`myapp ${VERSION} listening on port 3000`));

db.query("CREATE TABLE IF NOT EXISTS notes (id SERIAL PRIMARY KEY, text TEXT NOT NULL)")
  .then(() => console.log("database ready"))
  .catch((err) => console.error("database error:", err.message));
