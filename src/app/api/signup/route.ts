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
import { createAuthResponse } from "@/lib/server/createAuthResponse";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { name, password, birthDate, phone, email } = await request.json();

    const errors: any = {};

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    if (!phone) errors.phone = "Phone is required";
    if (!birthDate) errors.birthDate = "Birth date is required";
    if (!password) errors.password = "Password is required";

    if (birthDate && !isValidBirthDate(birthDate)) {
      errors.birthDate = "The date is not valid";
    }

    if (email && !isValidEmail(email)) {
      errors.email = "The email is not valid";
    }

    if (phone && !isValidPhone(phone)) {
      errors.phone = "The phone number is not valid";
    }

    if (password && !isValidPassword(password)) {
      errors.password =
        "The password must be at least 8 characters long, with an uppercase letter, lowercase letter, number, and special character.";
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errors.email = "This email already exists!";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
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

