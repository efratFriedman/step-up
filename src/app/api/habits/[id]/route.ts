import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import { habitSchema } from "@/lib/validation/habitValidation";
import mongoose from "mongoose";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(req: Request, { params }: any) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const habit = await Habit.findOne({ _id: id, userId }); // ← תיקון אבטחה

    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error: any) {
    console.error("GET /habits/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed" },
      { status: 401 }
    );
  }
}
export async function PUT(req: Request, { params }: any) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const { id } = params;

    const body = await req.json();

    const parsed = habitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: id, userId },
      parsed.data,
      { new: true }
    );

    if (!updatedHabit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHabit);
  } catch (error: any) {
    console.error("PUT /habits/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed" },
      { status: 401 }
    );
  }
}


export async function DELETE(req: Request, { params }: any) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const { id } = params;

    const deletedHabit = await Habit.findOneAndDelete({
      _id: id,
      userId, 
    });

    if (!deletedHabit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Habit deleted successfully",
      habit: deletedHabit,
    });
  } catch (error: any) {
    console.error("DELETE /habits/[id] error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed" },
      { status: 401 }
    );
  }
}