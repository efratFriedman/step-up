import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import { habitSchema } from "@/lib/validation/habitValidation";
import mongoose from "mongoose";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();

  const { id } = await context.params;
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const habit = await Habit.findById(id).populate("userId").populate("categoryId");
  
  if (!habit) {
    return NextResponse.json({ message: "Habit not found" }, { status: 404 });
  }

  return NextResponse.json(habit);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;
  const body = await request.json();

  const parsed = habitSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map(issue => ({
      field: issue.path.join("."), 
      message: issue.message,
    }));

    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 }
    );
  }

  const updatedHabit = await Habit.findByIdAndUpdate(id, parsed.data, { new: true });
  if (!updatedHabit)
    return NextResponse.json({ message: "Habit not found" }, { status: 404 });


  return NextResponse.json(updatedHabit);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await context.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
  }

  const deletedHabit = await Habit.findByIdAndDelete(id);
  
  if (!deletedHabit) {
    return NextResponse.json({ message: "Habit not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Habit deleted successfully", habit: deletedHabit });
}