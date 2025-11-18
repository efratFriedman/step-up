import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import mongoose from "mongoose";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const authUser = await authenticate(req);
  const authUserId = authUser._id.toString();

  const { id } = await context.params;

  if (id !== authUserId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const user = await User.findById(id).select("name email profileImg phone birthDate");

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
  const authUser = await authenticate(req);
  const authUserId = authUser._id.toString();

  const { id } = await context.params;
  const body = await req.json();

  if (id !== authUserId) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 403 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const updateFields = {
    name: body.name,
    phone: body.phone,
    birthDate: body.birthDate,
    profileImg: body.profileImg,
  };

  const updatedUser = await User.findByIdAndUpdate(
    id,
    updateFields,
    { new: true }
  ).select("name email phone birthDate profileImg");

  if (!updatedUser) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(updatedUser);
}
