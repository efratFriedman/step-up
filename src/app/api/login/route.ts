import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { isValidEmail, isValidPassword } from "@/services/server/validationService";
import { createAuthResponse } from "@/lib/server/createAuthResponse";   // ⭐ שימוש בפונקציה אחידה

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    console.log("Login attempt:", { email });

    if (!email || !password) {
      return NextResponse.json(
        { message: "Please enter both email and password" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "The email is not valid" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        {
          message:
            "The password must be at least 8 characters long, with an uppercase letter, lowercase letter, number, and special character.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    return createAuthResponse(user, `Welcome back ${user.name}!`);
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
