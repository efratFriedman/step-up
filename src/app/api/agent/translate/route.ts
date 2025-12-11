import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_TRANSLATE_API_KEY ||"",
});

export async function POST(req: Request) {
  try {
    const { text, targetLang } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const safeTarget =
      typeof targetLang === "string" && targetLang.length <= 5
        ? targetLang
        : "en";

    const prompt = `
You are a professional translation engine.

TASK:
- Detect the source language automatically.
- Translate the user's text ONLY into the target language: "${safeTarget}".
- The target language is given as a language code ("he", "en", "fr", etc.) or written name.
- KEEP emojis, line breaks and tone.
- DO NOT explain, comment or say what you did.
- DO NOT return JSON, markdown or quotes.
- Return ONLY the translated text.

User text:
"""
${text}
"""
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const translatedText = response.text?.trim();

    if (!translatedText) {
      return NextResponse.json(
        { error: "Translation unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json({ translatedText });
  } catch (err) {
    console.error("AI Translation Error:", err);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
