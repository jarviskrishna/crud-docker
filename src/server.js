const path = require("path");
const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const VERSION = process.env.APP_VERSION || "dev";

app.get("/health", (req, res) => {
  res.json({ status: "ok", version: VERSION });
});

// Create
app.post("/api/notes", async (req, res) => {
  if (!req.body.text) return res.status(400).json({ error: "text is required" });
  const result = await db.query(
    "INSERT INTO notes (text) VALUES ($1) RETURNING *",
    [req.body.text]
  );
  res.status(201).json(result.rows[0]);
});

// Read all
app.get("/api/notes", async (req, res) => {
  const result = await db.query("SELECT * FROM notes ORDER BY id");
  res.json(result.rows);
});

// Read one
app.get("/api/notes/:id", async (req, res) => {
  const result = await db.query("SELECT * FROM notes WHERE id = $1", [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ error: "not found" });
  res.json(result.rows[0]);
});

// Update
app.put("/api/notes/:id", async (req, res) => {
  if (!req.body.text) return res.status(400).json({ error: "text is required" });
  const result = await db.query(
    "UPDATE notes SET text = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
    [req.body.text, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ error: "not found" });
  res.json(result.rows[0]);
});

// Delete
app.delete("/api/notes/:id", async (req, res) => {
  const result = await db.query("DELETE FROM notes WHERE id = $1", [req.params.id]);
  if (result.rowCount === 0) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

app.listen(3000, () => console.log(`myapp ${VERSION} listening on port 3000`));

db.query(`CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
)`)
  .then(() => console.log("database ready"))
  .catch((err) => console.error("database error:", err.message));
