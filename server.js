```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "StudyMate AI backend is running"
  });
});

// Summarize notes
app.post("/api/summarize", (req, res) => {
  const text = String(req.body.text || "").trim();

  if (text.length < 10) {
    return res.status(400).json({
      error: "Please enter your study notes."
    });
  }

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

  res.json({
    summary: sentences.slice(0, 4)
      .map(sentence => sentence.trim())
      .join(" "),
    mode: "demo"
  });
});

// Generate quiz
app.post("/api/quiz", (req, res) => {
  const text = String(req.body.text || "").trim();

  if (text.length < 10) {
    return res.status(400).json({
      error: "Please enter your study notes."
    });
  }

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [];

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

  res.json({ quiz, mode: "demo" });
});

// Serve React frontend
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// React app fallback for homepage and frontend routes
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(distPath, "index.html"), err => {
    if (err) next(err);
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`StudyMate AI running on port ${PORT}`);
});
```