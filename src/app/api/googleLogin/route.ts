import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import { createAuthResponse } from "@/lib/server/createAuthResponse";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, googleId } = await request.json();

    if (!email || !googleId) {
      return NextResponse.json(
        { message: "Missing Google user data" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", redirectTo: "/signup" },
        { status: 404 }
      );
    }

    return createAuthResponse(
      user,
      `Welcome back ${user.name}!`
    );

  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
