import { NextResponse } from "next/server";
import { User } from "@/types/user";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";


export async function POST(request: Request) {
  try {
    const { name, password, birthDate, phone, email } = await request.json();

    console.log("New user:", { name, password, birthDate, phone, email });

    if (!name || !password || !birthDate || !phone || !email) {
      return NextResponse.json(
        { message: "Please fill in all required fields" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    return NextResponse.json({
      message: `Welcome ${name}! Your account has been created.`,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
