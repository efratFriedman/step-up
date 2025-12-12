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
            return NextResponse.json({
                allowed: false,
                reason: "empty",
                rewrite: null,
            });
        }

        const prompt = `
You are an AI moderation agent for a habit-building community app called StepUp.

CLASSIFICATION RULES:
1. If the post is about habits, progress, mindset, motivation, challenges, or achievements → allowed = true, rewrite = null.

2. If the post has a negative tone (self-doubt, hopelessness, attacks on self, discouragement):
   allowed = true
   reason = "negative"
   rewrite = a positive, supportive version in the SAME LANGUAGE.

3. If the post is irrelevant (news, gossip, politics, unrelated opinions):
   allowed = false
   reason = "irrelevant"
   rewrite = null

4. If media exists without text → allowed = true, rewrite = null.

LANGUAGE RULES:
- Detect the user’s language.
- Respond ONLY in that language.
- Never switch languages.
- Rewrite must be fully in the same language.

Return ONLY valid JSON:
{
  "allowed": boolean,
  "reason": string | null,
  "rewrite": string | null
}

Post content:
"""${content || ""}"""
Media: ${hasMedia ? "YES" : "NO"}
`;

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
                { error: "Invalid JSON output" },
                { status: 500 }
            );
        }

        return NextResponse.json(JSON.parse(jsonString));
    } catch (err) {
        console.error("FILTER ERROR", err);
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
