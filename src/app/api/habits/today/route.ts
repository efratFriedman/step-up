import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import mongoose from "mongoose";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(request: Request) {
  try {
    await dbConnect();


    const user = await authenticate(request);
    const userId = user._id; 

    const today = new Date();
    const todayIndex = today.getDay();

    const habitsToday = await Habit.find({
      userId: userId,
      [`days.${todayIndex}`]: true,
    }).populate("categoryId");

    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const logsToday = await HabitLog.find({
      userId: userId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const habitsWithStatus = habitsToday.map((habit) => {
      const log = logsToday.find((l) => l.habitId.toString() === habit._id.toString());
      return {
        _id: habit._id.toString(),
        name: habit.name,
        description: habit.description,
        category: habit.categoryId,
        isDone: log ? log.isDone : false,      };
    });

    return NextResponse.json({ habits: habitsWithStatus });

  } catch (error: any) {
    console.error("GET /habits/today error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch today's habits" },
      { status: 500 }
    );
  }
}