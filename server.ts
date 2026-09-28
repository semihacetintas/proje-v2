import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  buildAISentenceRulesPrompt,
  validateSentenceRules,
  buildVisualPrompt,
  registerGeneratedSentence,
  composeRandomSentence,
  buildSceneDescriptionFromSentence,
} from "./src/config/sentenceRules";
import { SAMPLE_CHALLENGES } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Gemini istemcisini sunucu tarafında başlat
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
} catch (error) {
  console.error("Failed to initialize Gemini client:", error);
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: !!ai });
});

// ============================================================================
// AI CÜMLE + GÖRSEL BULMACA ÜRETİMİ
// Tek sorumluluk: sentenceRules.ts'teki kurallara uyan bir 5 kelimelik İngilizce
// cümle üretmek, onu doğrulamak, ve tutarlı bir 3D Pixar tarzı görsel oluşturmak.
// ============================================================================

const SENTENCE_CHALLENGE_SCHEMA = {
  type: "OBJECT" as const,
  properties: {
    targetSentence: {
      type: "STRING" as const,
      description:
        "The 5-word English puzzle sentence, following the rules given in the system instruction exactly.",
    },
    visualPrompt: {
      type: "STRING" as const,
      description:
        "A crystal-clear scene description for illustration: the main living character (full body), the specific object it is holding or interacting with, and the place. No art-style words here (style is added separately).",
    },
  },
  required: ["targetSentence", "visualPrompt"],
};

interface GeneratedSentence {
  targetSentence: string;
  visualPrompt: string;
}

function buildSentenceSystemInstruction(): string {
  const rulesPrompt = buildAISentenceRulesPrompt();
  return `${rulesPrompt}

You are also generating a "visualPrompt": a crystal-clear description of the scene (character + object + place) for an illustrator. Do not include art-style words (e.g. "3D", "Pixar", "vector") in visualPrompt — only describe the content of the scene itself.

Respond ONLY with a valid JSON object in exactly this shape, no markdown, no extra text:
{"targetSentence": "...", "visualPrompt": "..."}`;
}

/** Gemini ile bir cümle denemesi üretir (JSON döner ya da null). */
async function tryGenerateSentenceWithGemini(systemInstruction: string): Promise<any | null> {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Generate one brand-new puzzle sentence now. Make it different from common examples.",
      config: {
        systemInstruction,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: SENTENCE_CHALLENGE_SCHEMA,
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("[Sentence gen / Gemini] hata:", err);
    return null;
  }
}

/** OpenAI (gpt-5.6-luna, ucuz/hızlı metin modeli) ile bir cümle denemesi üretir. */
async function tryGenerateSentenceWithOpenAI(systemInstruction: string, openaiKey: string): Promise<any | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: "Generate one brand-new puzzle sentence now. Make it different from common examples." },
        ],
        response_format: { type: "json_object" },
      }),
    });
    

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      if (data?.error?.message) console.warn("[Sentence gen / OpenAI] hata:", data.error.message);
      return null;
    }
    return JSON.parse(text);
  } catch (err) {
    console.error("[Sentence gen / OpenAI] hata:", err);
    return null;
  }
}

/**
 * AI ile kurallara uygun bir cümle üretmeyi dener (önce Gemini, o yoksa/başarısız olursa OpenAI).
 * Çıktı sentenceRules.ts'teki validateSentenceRules ile doğrulanır; geçersizse birkaç kez daha denenir.
 * Tüm denemeler başarısız olursa null döner (çağıran taraf fallback kullanır).
 */
async function generateSentenceWithAI(openaiKey: string): Promise<GeneratedSentence | null> {
  if (!ai && !openaiKey) return null;

  const systemInstruction = buildSentenceSystemInstruction();
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const parsed = ai
      ? await tryGenerateSentenceWithGemini(systemInstruction)
      : await tryGenerateSentenceWithOpenAI(systemInstruction, openaiKey);

    if (!parsed?.targetSentence) continue;

    const validation = validateSentenceRules(parsed.targetSentence);
    if (validation.isValid) {
      registerGeneratedSentence(validation.cleanSentence); // sonraki üretimde bu özneden kaçınılsın
      return {
        targetSentence: validation.cleanSentence,
        visualPrompt: parsed.visualPrompt || validation.cleanSentence,
      };
    }

    console.warn(`[Sentence gen] Deneme ${attempt} kurallara uymadı:`, validation.errors);
  }

  console.warn("[Sentence gen] Tüm denemeler başarısız, fallback cümle kullanılacak.");
  return null;
}

/** Gemini 3.1 Flash Image ("Nano Banana") ile görsel üretir. */
async function generateImageWithGemini(prompt: string): Promise<string | null> {
  if (!ai) return null;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: prompt,
      config: {
        imageConfig: { aspectRatio: "1:1" },
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (err: any) {
    console.warn("[Gemini 3.1 Flash Image] başarısız:", err?.message || err);
  }
  return null;
}

/** Kullanıcının kendi girdiği OpenAI anahtarı varsa gpt-image-2 ile görsel üretir. */
async function generateImageWithOpenAI(prompt: string, openaiKey: string): Promise<string | null> {
  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-2",
        prompt,
        n: 1,
        size: "1024x1024",
        quality: "low", // "high" 100+ saniye sürebiliyor (dahili planlama adımı yüzünden); "low" ~15 sn civarına iniyor — oyun akışı için şart
      }),
    });

    const data = await response.json();
    if (data?.data?.[0]?.url) return data.data[0].url;
    if (data?.data?.[0]?.b64_json) return `data:image/png;base64,${data.data[0].b64_json}`;
    if (data?.error?.message) console.warn("[OpenAI gpt-image-2] hata:", data.error.message);
  } catch (err: any) {
    console.warn("[OpenAI gpt-image-2] fetch başarısız:", err?.message || err);
  }
  return null;
}

app.post("/api/generate-sentence-challenge", async (req, res) => {
  try {
    const openaiKey = (req.body?.openaiKey || process.env.OPENAI_API_KEY || "").toString().trim();

    // 1) Cümleyi üret ve kurallara göre doğrula (geçersizse otomatik olarak tekrar dener)
    const aiSentence = await generateSentenceWithAI(openaiKey);

    let targetSentence: string;
    let sceneDescription: string;

    if (aiSentence?.targetSentence) {
      targetSentence = aiSentence.targetSentence;
      sceneDescription = aiSentence.visualPrompt;
    } else {
      // AI başarısız olursa kelime havuzlarından gramer kurallarına uygun cümle birleştir
      const composed = composeRandomSentence();
      if (composed) {
        targetSentence = composed;
        sceneDescription = buildSceneDescriptionFromSentence(composed);
      } else {
        const fallback = SAMPLE_CHALLENGES[Math.floor(Math.random() * SAMPLE_CHALLENGES.length)];
        targetSentence = fallback.targetSentence;
        sceneDescription = fallback.visualPrompt;
        registerGeneratedSentence(targetSentence);
      }
    }

    // 2) Sahne açıklamasını RESMİ stil ile birleştir (tek kaynak: sentenceRules.ts)
    const finalPrompt = buildVisualPrompt(sceneDescription);

    // 3) Görseli üret: kullanıcı kendi OpenAI anahtarını verdiyse önce onu dene,
    //    sonra Gemini 3.1 Flash Image (asıl/varsayılan yol), en son (nadiren) Pollinations.
    let imageUrl: string | null = null;
    let imageProvider = "";

    if (openaiKey) {
      imageUrl = await generateImageWithOpenAI(finalPrompt, openaiKey);
      if (imageUrl) imageProvider = "OpenAI (gpt-image-2)";
    }

    if (!imageUrl) {
      imageUrl = await generateImageWithGemini(finalPrompt);
      if (imageUrl) imageProvider = "Google Gemini (gemini-3.1-flash-image)";
    }

    if (!imageUrl) {
      const seed = Math.floor(Math.random() * 1000000);
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&seed=${seed}&nologo=true&private=true&model=flux`;
      imageProvider = "Pollinations AI (son çare yedek)";
    }

    const targetWords = targetSentence.split(" ").filter((w) => w.length > 0);

    res.json({
      id: "sc-ai-" + Math.random().toString(36).substring(2, 9),
      targetSentence,
      targetWords,
      imageUrl,
      visualPrompt: sceneDescription,
      imageProvider,
    });
  } catch (error: any) {
    console.error("Generate sentence challenge error:", error);
    res.status(500).json({ error: "Failed to generate AI puzzle." });
  }
});

// Serve frontend
async function startServer() {
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
