import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("http://api.quotable.io/random", {
        headers: {
          "Accept": "application/json",
          "User-Agent": "Next.js Server"
        }
      });
    const data = await response.json();
    
    return NextResponse.json({
      content: data.content,
      author: data.author,
    });
  } catch (err) {
    console.error("Quote fetch error:", err);
    return NextResponse.json({ message: "Failed to fetch quote" }, { status: 500 });
  }
}
