import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { generateTemporaryPassword } from "@/services/server/validationService";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    // מחולל סיסמה זמנית
    const tempPassword = generateTemporaryPassword();

    // כאן תעדכני במסד שלך את הסיסמה הזמנית למשתמש הזה
    // updateUserTempPassword(email, tempPassword);

    // שליחת מייל
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: "Temporary Password",
      text: `Your temporary password is: ${tempPassword}`,
    });

    return NextResponse.json({ tempPassword });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
