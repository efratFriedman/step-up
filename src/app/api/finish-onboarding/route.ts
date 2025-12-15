import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import { authenticate } from "@/lib/server/authMiddleware";

export async function POST(request: Request) {
  try {
    await dbConnect();

    // מזהה את המשתמש דרך הטוקן
    const user = await authenticate(request);

    if (!user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await User.findByIdAndUpdate(user._id, { isFirstLogin: false });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Finish onboarding error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
