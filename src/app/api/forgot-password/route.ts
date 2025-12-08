import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

import { generateTemporaryPassword } from "@/services/server/validationService";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    const tempPassword = generateTemporaryPassword();

    const templatePath = path.join(
      process.cwd(),
      "src",
      "emails",
      "resetPasswordEmail.html"
    );

    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?email=${email}&temp=${tempPassword}`;

    htmlTemplate = htmlTemplate
      .replace("{{TEMP_PASSWORD}}", tempPassword)
      .replace("{{RESET_LINK}}", resetLink);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"stepup.betterhabits" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your Temporary Password",
      html: htmlTemplate,
    });

    return NextResponse.json({ tempPassword });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
