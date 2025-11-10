import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import bcrypt from 'bcrypt';
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

function isValidPhone(phone: string) {
  const phoneRegex = /^(\+972|0)([234589]|5[0-9])\d{7}$/;
  return phoneRegex.test(phone);
}

function isValidBirthDate(birthDate: string) {
  const date = new Date(birthDate);
  const now = new Date();
  if (isNaN(date.getTime()) || date > now) return false;
  const minAge = 8;
  const age = now.getFullYear() - date.getFullYear();
  if (age < minAge) return false;

  return true;
}

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

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "the email is not valid" },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: "The password must be at least 8 characters long, with an uppercase letter, lowercase letter, number, and special character." },
        { status: 400 }
      );
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { message: "the phone number is not valid" },
        { status: 400 }
      );
    }

    if (!isValidBirthDate(birthDate)) {
      return NextResponse.json(
        { message: "the date is not valid" },
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
