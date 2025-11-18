import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import bcrypt from "bcrypt";
import {
  isValidBirthDate,
  isValidEmail,
  isValidPassword,
  isValidPhone
} from "@/services/validationService";
import { createAuthResponse } from "@/lib/server/createAuthResponse";   // ⭐ שימוש בפונקציה המשותפת

export async function POST(request: Request) {
  try {
    console.log("sgdvabxhznjKL");
    
    await dbConnect();
    const { name, password, birthDate, phone, email } = await request.json();
    console.log("RAW BODY VALUES:");
    console.log("name:", JSON.stringify(name));
    console.log("email:", JSON.stringify(email));
    console.log("phone:", JSON.stringify(phone));
    console.log("birthDate:", JSON.stringify(birthDate));
    console.log("password:", JSON.stringify(password));

    console.log("New user:", { name, email, birthDate, phone });

    if (!name || !password || !birthDate || !phone || !email) {
      return NextResponse.json(
        { message: "Please fill in all required fields" },
        { status: 400 }
      );
    }

    if (!isValidBirthDate(birthDate)) {
      return NextResponse.json({ message: "The date is not valid" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "The email is not valid" }, { status: 400 });
    }

    if (!isValidPhone(phone)) {
      return NextResponse.json({ message: "The phone number is not valid" }, { status: 400 });
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email already exists!" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      phone,
      birthDate,
      password: hashedPassword,
    });

    return createAuthResponse(
      newUser,
      `Welcome ${name}! Your account has been created.`
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
