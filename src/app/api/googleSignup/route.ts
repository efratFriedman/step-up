import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { createAuthResponse } from "@/lib/server/createAuthResponse";  

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, googleId, profileImg } = body;

    if (!name || !email || !googleId) {
      return NextResponse.json(
        { message: "Missing required Google user data" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.profileImg = profileImg;
        await user.save();
      }
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        profileImg: profileImg || "",
        password: null, 
      });
    }


 const tokenUser = {
      _id: user._id.toString(), 
      name: user.name,
      email: user.email,
    };

    return createAuthResponse(
      tokenUser,
      `Welcome ${user.name} Your account has been created.`
    );

  } catch (error) {
    console.error("❌ Google signup error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
