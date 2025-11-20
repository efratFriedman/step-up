import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import mongoose from "mongoose";
import "@/models/User";
import "@/models/Category";
import { habitSchema } from "@/lib/validation/habitValidation";
import { authenticate } from "@/lib/server/authMiddleware";


export async function GET(req: Request) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const habits = await Habit.find({ userId });

    return NextResponse.json(habits);
  } catch (error: any) {
    console.error("GET /habits error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to fetch habits" },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const user = await authenticate(request); 
    const userId = user._id;

    const body = await request.json();

    const parsed = habitSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { name, description, categoryId, reminderTime, days } = parsed.data;
    console.log(days);
    const newHabit = await Habit.create({
      userId,
      name,
      description,
      categoryId: categoryId ? new mongoose.Types.ObjectId(categoryId) : undefined,
      reminderTime,
      days,
    });

    return NextResponse.json(newHabit, { status: 201 });
  } catch (error: any) {
    console.error("POST /habits error:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to create habit" },
      { status: 401 }
    );
  }
}