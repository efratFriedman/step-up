import { NextResponse } from "next/server";

export async function GET() {
  try {
    const zenReq = fetch("https://zenquotes.io/api/today", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Next.js Server",
      },
      cache: "no-cache",
    });

    const affReq =  fetch("https://www.affirmations.dev/", {
      headers: {
        "Accept": "application/json",
        "User-Agent": "Next.js Server",
      },
      cache: "no-cache",
    });

    const [zenResponse, affResponse] = await Promise.all([zenReq, affReq]);
    const zenData = zenResponse.ok ? await zenResponse.json() : null;
    const affData = affResponse.ok ? await affResponse.json() : null;

    const messages = [];

    if (zenData && Array.isArray(zenData)) {
      messages.push({
        content: zenData[0].q,
        author: zenData[0].a,
      });
    }

    if (affData && affData.affirmation) {
      messages.push({
        content: affData.affirmation,
        author: "StepUp",
      });
    }

    if (messages.length === 0) {
      return NextResponse.json(
        { message: "No quotes available" }, 
        { status: 500 });
    }
    
    const randomMessage =
      messages[Math.floor(Math.random() * messages.length)];

    return NextResponse.json(randomMessage);
  } catch (err) {
    console.error("Quote fetch error:", err);
    return NextResponse.json({ message: "Failed to fetch quote" }, { status: 500 });
  }
}
