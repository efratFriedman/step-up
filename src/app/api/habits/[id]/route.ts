import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;
  console.log("Fetching habit with id:", id); 

  const habit = await Habit.findById(id).populate("userId").populate("categoryId");
  if (!habit) return NextResponse.json({ message: "Habit not found" }, { status: 404 });

  return NextResponse.json(habit);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;
  const body = await request.json();

  const updatedHabit = await Habit.findByIdAndUpdate(id, body, { new: true });
  if (!updatedHabit) return NextResponse.json({ message: "Habit not found" }, { status: 404 });

  return NextResponse.json(updatedHabit);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  const deletedHabit = await Habit.findByIdAndDelete(id);
  if (!deletedHabit) return NextResponse.json({ message: "Habit not found" }, { status: 404 });

  return NextResponse.json({ message: "Habit deleted successfully", habit: deletedHabit });
}
