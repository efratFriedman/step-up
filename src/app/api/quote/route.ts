import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://type.fit/api/quotes", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Next.js Server"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Quotes API error" }, { status: 500 });
    }

    const allQuotes = await response.json(); 
    const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];

    return NextResponse.json({
      content: randomQuote.text,
      author: randomQuote.author || "Unknown",
    });
  } catch (err) {
    console.error("Quote fetch error:", err);
    return NextResponse.json({ message: "Failed to fetch quote" }, { status: 500 });
  }
}
