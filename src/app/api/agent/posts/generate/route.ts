// app/api/agent/posts/generate/route.ts
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_GENERATE_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea || typeof idea !== "string") {
      return NextResponse.json(
        { error: "Missing input text (idea)" },
        { status: 400 }
      );
    }

    const prompt = `
You are the AI writer for StepUp, a habit-building motivation app.

Create a NEW, ORIGINAL inspirational post based on the user's idea.
Do NOT rewrite or paraphrase the idea.
Instead, generate a fresh, unique StepUp-style post.

Write the post in a natural human style.
Do NOT use long dashes (—), double hyphens (--), ellipses (...), or overly formal punctuation.
Use simple, clean punctuation like a real person writing online.
Avoid robotic tone.
Sentences must sound natural, conversational, warm, and human.
Do NOT use perfect symmetry or overly polished structure.
Vary rhythm and flow naturally, as if a person wrote it freely.
Do NOT use emojis unless the user already used them.
Do NOT use hashtags.
Write in a relatable, friendly tone.


LANGUAGE RULES:
- Detect the user's dominant language.
- Respond ONLY in that language.
- Do NOT mix or switch languages.

STYLE RULES:
- 2–4 sentences.
- Motivational, uplifting, human.
- No lists, no bullets, no hashtags.
- Add a natural closing sentence that YOU choose (different every time).
- Do NOT mention the word “idea” or that this was generated.



USER IDEA:
"""${idea}"""

OUTPUT:
Write ONLY the final post text.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ text: prompt }],
    });

    const text =
      response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    return NextResponse.json({ post: text });
  } catch (err: any) {
    console.error("GENERATE POST ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Generation failed" },
      { status: 500 }
    );
  }
}
