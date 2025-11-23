import { dbConnect } from "@/lib/DB";
import HabitLog from "@/models/HabitLog";
import Habit from "@/models/Habit";
import { startOfDay, endOfDay } from "@/utils/date";
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/server/authMiddleware";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const user = await authenticate(req);
    const userId = user._id;

    const body = await req.json();
    const { habitId, date } = body;

    if (!habitId || !date) {
      return NextResponse.json(
        { message: "habitId and date are required" },
        { status: 400 }
      );
    }

    const habit = await Habit.findOne({ _id: habitId, userId });
    if (!habit) {
      return NextResponse.json(
        { message: "Habit not found" },
        { status: 404 }
      );
    }

    const targetDate = new Date(date);
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    let log = await HabitLog.findOne({
      habitId: habitId,
      userId: userId,
      date: { $gte: start, $lte: end }
    });

    if (log) {
      log.isDone = !log.isDone;
      await log.save();
    } else {
      log = await HabitLog.create({
        habitId: habitId,
        userId: userId,
        date: targetDate,
        isDone: true
      });
    }

    const updatedHabit = {
      _id: habit._id?.toString(),
      name: habit.name,
      description: habit.description,
      category: habit.categoryId,
      isDone: log.isDone
    };

    return NextResponse.json({ habit: updatedHabit });
  } catch (err: any) {
    console.error("POST /api/habit-log/toggle error:", err);
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}