import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure the local data directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to read and write files safely
function readJsonFile<T>(filename: string, defaultValue: T): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

function writeJsonFile<T>(filename: string, data: T): void {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
  }
}

// Initial Leaderboard Seed
const DEFAULT_LEADERBOARD = [
  { username: "SolarTypist", score: 12500, wordsTyped: 1540, accuracy: 98.4, area: "Star Observatory", date: "2026-06-25" },
  { username: "LeafSinger", score: 9800, wordsTyped: 1210, accuracy: 96.5, area: "Cozy Village", date: "2026-06-27" },
  { username: "CloudWriter", score: 8750, wordsTyped: 1050, accuracy: 97.1, area: "Floating Islands", date: "2026-06-28" },
  { username: "CrystalScribe", score: 6200, wordsTyped: 820, accuracy: 95.8, area: "Crystal Mountains", date: "2026-06-28" },
  { username: "AquaDreamer", score: 4100, wordsTyped: 510, accuracy: 94.2, area: "Coral Sea", date: "2026-06-29" }
];

// Lazy Gemini API Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY environment variable is not set or has placeholder value.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// GET Leaderboard
app.get("/api/leaderboard", (req, res) => {
  const leaderboard = readJsonFile("leaderboard.json", DEFAULT_LEADERBOARD);
  res.json(leaderboard);
});

// POST Leaderboard Entry
app.post("/api/leaderboard", (req, res) => {
  const { username, score, wordsTyped, accuracy, area } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const leaderboard = readJsonFile("leaderboard.json", DEFAULT_LEADERBOARD);
  const entry = {
    username: String(username).substring(0, 30),
    score: Number(score) || 0,
    wordsTyped: Number(wordsTyped) || 0,
    accuracy: Number(accuracy) || 100,
    area: String(area || "Whispering Forest"),
    date: new Date().toISOString().split("T")[0]
  };

  leaderboard.push(entry);
  // Sort by score descending and take top 25
  leaderboard.sort((a, b) => b.score - a.score);
  const trimmed = leaderboard.slice(0, 25);
  writeJsonFile("leaderboard.json", trimmed);
  res.json({ success: true, leaderboard: trimmed });
});

// SUBMIT feedback or bug
app.post("/api/feedback", (req, res) => {
  const { type, username, email, title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const list = readJsonFile<any[]>("feedback.json", []);
  const entry = {
    id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type: type === "bug" ? "bug" : "feedback",
    username: String(username || "Anonymous"),
    email: String(email || ""),
    title: String(title).substring(0, 100),
    description: String(description).substring(0, 2000),
    createdAt: new Date().toISOString()
  };

  list.push(entry);
  writeJsonFile("feedback.json", list);
  res.json({ success: true, submission: entry });
});

// POST Save Game
app.post("/api/saves", (req, res) => {
  const saveData = req.body;
  if (!saveData.username) {
    return res.status(400).json({ error: "Username is required to save progress" });
  }

  const key = String(saveData.username).toLowerCase().trim();
  const saves = readJsonFile<Record<string, any>>("saves.json", {});
  saves[key] = {
    ...saveData,
    updatedAt: new Date().toISOString()
  };

  writeJsonFile("saves.json", saves);
  res.json({ success: true, save: saves[key] });
});

// GET Save Game
app.get("/api/saves/:username", (req, res) => {
  const username = req.params.username;
  const key = String(username).toLowerCase().trim();
  const saves = readJsonFile<Record<string, any>>("saves.json", {});

  if (saves[key]) {
    res.json(saves[key]);
  } else {
    res.status(404).json({ error: "Save not found" });
  }
});

// POST AI Story Generator
app.post("/api/generate-story", async (req, res) => {
  const { areaName, currentScore, previousText, bossName } = req.body;

  if (!areaName) {
    return res.status(400).json({ error: "Area Name is required for generating a story segment." });
  }

  try {
    const ai = getGeminiClient();

    const systemPrompt = `You are an expert fantasy writer creating "TypeTales", a cozy cinematic typing adventure game.
The art direction is "cozy fantasy + storybook + solarpunk". Warm, friendly, inviting, rounded, and clean. No violence, horror, or realistic blood.
The focus is on healing, restoring nature, breaking ancient curses, discovering friendship, and calming giant corrupted spirits.
Your job is to generate the next continuous, engaging paragraph of the fantasy story based on the user's location, current progress, and the previous context.
- Keep the length to about 3 to 4 sentences (approx. 40-60 words).
- Make sure the paragraph flows perfectly from the previous text provided.
- Avoid repeating words or descriptions from the previous text.
- Use cozy, beautiful, solarpunk imagery (windmills, warm light, flowers, butterflies, crystals, gentle rain).
- Output ONLY the clean, raw story text. Do not include markdown, greetings, meta comments, or headers. No intro/outro.`;

    const prompt = `Current Area: ${areaName}
${bossName ? `Corrupted Guardian Encounter: ${bossName}` : ""}
Current Player Score: ${currentScore || 0}
Previous Story Text (for continuity): "${previousText || "The adventure begins..."}"

Write the next beautifully descriptive paragraph of this journey. Focus on how the typing of magical words cleanses the landscape and heals the surroundings.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const generatedText = response.text?.trim() || "";

    if (!generatedText) {
      throw new Error("Empty response from Gemini.");
    }

    // Keep generated stories in a local history log for diagnostic/analytics review
    const storyLogs = readJsonFile<any[]>("generated_stories.json", []);
    storyLogs.push({
      areaName,
      bossName,
      score: currentScore,
      prompt,
      generatedText,
      timestamp: new Date().toISOString()
    });
    writeJsonFile("generated_stories.json", storyLogs);

    res.json({ text: generatedText });
  } catch (error: any) {
    console.error("AI Generation Error:", error.message || error);
    res.status(500).json({
      error: "Could not generate story segment via AI.",
      details: error.message || String(error),
      fallback: true
    });
  }
});

// Configure Vite middleware or production static files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
