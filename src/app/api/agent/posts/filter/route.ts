import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_FILTER_API_KEY || "",
});

function extractJSON(raw: string): string | null {
    const match = raw.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
}

export async function POST(req: Request) {
    try {
        const { content, hasMedia } = await req.json();

        if (!content && !hasMedia) {
            return NextResponse.json(
                { allowed: false, reason: "Post is empty", rewrite: null },
                { status: 400 }
            );
        }


        const prompt = `
   You are an AI moderation agent for a habit-building community app called StepUp.

Your tasks:
1. Check if the post is RELEVANT to self-improvement, habits, progress, mindset, challenges, or achievements.
2. If the tone is overly negative:
    - allowed= false
    - reason= "negative tone"
    - rewrite= improved motivational version
3. If irrelevant → allowed = false + reason.
4. If relevant → allowed = true.
5. If rewritten → include "rewrite" field.
6. If no change needed → rewrite = null.
7. If media exists without text → allowed = true and rewrite = null.

LANGUAGE RULES:
- Detect the user's dominant language from their post.
- Respond ONLY in that language.
- Do NOT switch languages.
- Do NOT translate the content.
- If rewriting, rewrite using the SAME language the user wrote in.

Return ONLY JSON in this exact format:
{
  "allowed": boolean,
  "reason": string | null,
  "rewrite": string | null
}

Post content:
"""${content || ""}"""
Media attached: ${hasMedia ? "YES" : "NO"}
   `

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: prompt }],
        });

        const raw = response.text?.trim();
        if (!raw) {
            return NextResponse.json(
                { error: "AI returned empty response" },
                { status: 500 }
            );
        }

        const jsonString = extractJSON(raw);
        if (!jsonString) {
            return NextResponse.json(
                { error: "Invalid JSON from AI" },
                { status: 500 }
            );
        }

        const aiData = JSON.parse(jsonString);

        return NextResponse.json(aiData);
    }
    catch (err: any) {
        console.error("AI Filter Error:", err);
        return NextResponse.json(
            {
                allowed: true,
                reason: null,
                rewrite: null,
            },
            { status: 200 }
        );
    }
}