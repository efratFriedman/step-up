import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import { createAuthResponse } from "@/lib/server/createAuthResponse";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, googleId, name, profileImg } = await request.json();

    if (!email || !googleId || !name) {
      return NextResponse.json(
        { message: "Missing Google user data" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        googleId,
        name,
        profileImg,
        password: null,
      });
    } else if (!user.googleId) {
      user.googleId = googleId;
      user.profileImg ??= profileImg;
      await user.save();
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
