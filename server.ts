import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

async function startServer() {
  const app = express();
  app.use(express.json());

  // API route for AI Smart Lister (generate title, description, tags, suggested price)
  app.post("/api/ai/smart-lister", async (req, res) => {
    try {
      const { prompt, category, condition } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `You are an expert secondhand marketplace listing assistant. The user wants to sell an item described as: "${prompt}". Category: ${category || "General"}, Condition: ${condition || "Good"}. Generate a JSON response with:
        - "title": A catchy, SEO-friendly listing title (max 60 chars)
        - "description": A detailed, persuasive secondhand description highlighting features and condition (approx 3-4 sentences)
        - "suggestedPrice": A realistic estimated market price in USD as a number (e.g. 45)
        - "tags": Array of 3-5 relevant search tags
        Return ONLY valid JSON.`,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const data = JSON.parse(text);
      res.json(data);
    } catch (error: any) {
      console.error("AI Smart Lister Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate listing details" });
    }
  });

  // API route for AI Price Estimator & Market Insights
  app.post("/api/ai/price-estimate", async (req, res) => {
    try {
      const { title, category, condition } = req.body;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Provide market valuation for secondhand item: "${title}" in category "${category}" with condition "${condition}". Return JSON with:
        - "estimatedValue": number (e.g. 120)
        - "priceRange": { "low": number, "high": number }
        - "demandLevel": "High" | "Moderate" | "Low"
        - "sellingTips": string (one sentence advice to sell fast)
        Return ONLY valid JSON.`,
        config: {
          responseMimeType: "application/json",
        },
      });
      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error: any) {
      console.error("AI Price Estimator Error:", error);
      res.status(500).json({ error: error.message || "Failed to estimate price" });
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });

  app.use(vite.middlewares);

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
