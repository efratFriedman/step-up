import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req: NextRequest) {
  await dbConnect();

  const { email, newPassword } = await req.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { message: "Missing fields" },
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

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;

  await user.save();

  return NextResponse.json({ message: "Password updated successfully" });
}
