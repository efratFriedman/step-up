import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import User from "@/models/User";
import mongoose from "mongoose";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const authUser = await authenticate(req);
    const authUserId = authUser._id.toString();

    if (id !== authUserId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).select(
      "name email profileImg phone birthDate"
    );

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);

  } catch (error: any) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    const authUser = await authenticate(req);
    const authUserId = authUser._id.toString();
    const body = await req.json();

    if (id !== authUserId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 403 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID format" },
        { status: 400 }
      );
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
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);

  } catch (error: any) {
    console.error("PUT /api/users/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to update user" },
      { status: 500 }
    );
  }
}
