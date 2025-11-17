import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const user = await User.findById(id).select("name email profileImg");
  
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  
  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  const body = await req.json();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { 
      name: body.name,
      phone: body.phone,
      birthDate: body.birthDate,
      profileImg: body.profileImg,
      password: body.password,
    },
    { new: true }
  ).select("name email phone birthDate profileImg");
  
  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  
  return NextResponse.json(updatedUser);
}