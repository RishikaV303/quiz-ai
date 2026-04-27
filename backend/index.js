import exp from "express";
import cors from "cors";
import { pool } from "./db.js";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const app = exp();
app.use(cors());
app.use(exp.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "DB error" });
  }
});
// User registration endpoint
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password],
    );

    res.json({ user: result.rows[0] });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Registration failed" });
  }
});
// User login endpoint
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1 AND password=$2",
      [email, password],
    );

    if (result.rows.length > 0) {
      res.json({ user: result.rows[0] });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Quiz generation endpoint
app.post("/quiz", async (req, res) => {
  const { topic, difficulty } = req.body;

  try {
    // 🔥 TRY AI
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate 5 ${difficulty} level MCQ questions on ${topic}.

Return ONLY JSON format like:
[
  {
    "question": "string",
    "options": ["A","B","C","D"],
    "answer": "correct option"
  }
]`,
                },
              ],
            },
          ],
        }
      );

      let text =
        response.data.candidates[0].content.parts[0].text;

      console.log("RAW AI:", text);

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const match = text.match(/\[\s*{[\s\S]*}\s*\]/);

      if (match) {
        const questions = JSON.parse(match[0]);
        return res.json({ questions });
      }
    } catch (aiErr) {
      console.log("AI failed, using fallback");
    }

    // 🔥 FALLBACK (WITH DIFFICULTY)
    const questions = [
      {
        question: `${topic} (${difficulty}) - What is it?`,
        options: ["Language", "Framework", "Library", "Database"],
        answer: "Language",
      },
      {
        question: `${topic} (${difficulty}) is used for?`,
        options: ["Frontend", "Backend", "Both", "None"],
        answer: "Both",
      },
      {
        question: `${topic} (${difficulty}) belongs to?`,
        options: ["Programming", "Design", "Testing", "Networking"],
        answer: "Programming",
      },
      {
        question: `${topic} (${difficulty}) is popular for?`,
        options: ["Speed", "UI", "Database", "Security"],
        answer: "UI",
      },
      {
        question: `Which is related to ${topic} (${difficulty})?`,
        options: ["HTML", "CSS", "JS", "All"],
        answer: "All",
      },
    ];

    res.json({ questions });

  } catch (err) {
    res.status(500).json({ error: "Failed" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
