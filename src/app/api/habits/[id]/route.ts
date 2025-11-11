import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const habit = await Habit.findById(params.id).populate("userId").populate("categoryId");
    if (!habit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }
    return NextResponse.json(habit);
  } catch (error) {
    console.error("GET /habits/:id error:", error);
    return NextResponse.json({ message: "Failed to fetch habit" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const body = await request.json();
    const updatedHabit = await Habit.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedHabit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }
    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error("PUT /habits/:id error:", error);
    return NextResponse.json({ message: "Failed to update habit" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const deletedHabit = await Habit.findByIdAndDelete(params.id);
    if (!deletedHabit) {
      return NextResponse.json({ message: "Habit not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("DELETE /habits/:id error:", error);
    return NextResponse.json({ message: "Failed to delete habit" }, { status: 500 });
  }
}
