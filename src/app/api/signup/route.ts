import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, password, birthDate, phone, email } = await request.json();

    console.log("New user:", { name, password, birthDate, phone, email });

    if (!name || !password || !birthDate || !phone || !email) {
      return NextResponse.json(
        { message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "this email is already exist!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      phone,
      birthDate,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" } 
    );

    const response = NextResponse.json({
      message: `Welcome ${name}! Your account has been created.`,
    });
   
    response.cookies.set("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, 
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "error!" },
      { status: 500 }
    );
  }
}
