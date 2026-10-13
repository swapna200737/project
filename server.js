import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "StudyMate AI backend is running"
  });
});

app.post("/api/summarize", (req, res) => {
  const text = String(req.body.text || "").trim();

  if (text.length < 10) {
    return res.status(400).json({
      error: "Please enter your study notes."
    });
  }

  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];

  const summary = sentences
    .slice(0, 4)
    .map(sentence => sentence.trim())
    .join(" ");

  res.json({
    summary,
    mode: "demo"
  });
});

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

  res.json({
    quiz,
    mode: "demo"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});