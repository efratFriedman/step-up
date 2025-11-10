import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password: string) {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

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
      console.log("email")
      return NextResponse.json(
        { message: "the email is not valid" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      console.log("password")
      return NextResponse.json(
        { message: "The password must be at least 8 characters long, with an uppercase letter, lowercase letter, number, and special character." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: `Welcome back ${user.name}!`,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }
                           , { status: 500 });
  }
}
