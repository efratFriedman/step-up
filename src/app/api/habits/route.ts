import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";

export async function GET() {
  try {
    await dbConnect();
    const habits = await Habit.find().populate("userId").populate("categoryId");
    return NextResponse.json(habits);
  } catch (error) {
    console.error("GET /habits error:", error);
    return NextResponse.json({ message: "Failed to fetch habits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { userId, name, description, categoryId, reminderTime, days } = body;

    if (!userId || !name) {
      return NextResponse.json({ message: "userId and name are required" }, { status: 400 });
    }

    const newHabit = new Habit({
      userId,
      name,
      description,
      categoryId,
      reminderTime,
      days,
    });

    await newHabit.save();
    return NextResponse.json(newHabit, { status: 201 });
  } catch (error) {
    console.error("POST /habits error:", error);
    return NextResponse.json({ message: "Failed to create habit" }, { status: 500 });
  }
}
