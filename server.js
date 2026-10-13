javascript
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "dist");

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "StudyMate AI backend is running"
  });
});

// Summarize study notes (demo mode)
app.post("/api/summarize", (req, res) => {
  const text = String(req.body?.text || "").trim();

  if (text.length < 10) {
    return res.status(400).json({
      error: "Please enter at least 10 characters of study notes."
    });
  }

  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

  const summary = sentences
    .slice(0, 4)
    .map(sentence => sentence.trim())
    .join(" ");

  res.json({
    summary,
    mode: "demo"
  });
});

// Generate quiz questions (demo mode)
app.post("/api/quiz", (req, res) => {
  const text = String(req.body?.text || "").trim();

  if (text.length < 10) {
    return res.status(400).json({
      error: "Please enter at least 10 characters of study notes."
    });
  }

  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

  const quiz = sentences
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length > 25)
    .slice(0, 5)
    .map((sentence, index) => ({
      question: `Question ${index + 1}: Which statement is from your notes?`,
      options: [
        sentence,
        "This information is unrelated.",
        "The notes contain no information.",
        "None of these statements."
      ],
      answer: 0
    }));

  res.json({
    quiz,
    mode: "demo"
  });
});

// Serve React frontend
if (fs.existsSync(path.join(distPath, "index.html"))) {
  app.use(express.static(distPath));

  // React frontend fallback
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).send(
      "StudyMate AI backend is running. Frontend build is not available yet."
    );
  });
}

// Handle unknown API endpoints
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "API endpoint not found"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`StudyMate AI server running on port ${PORT}`);
});
```