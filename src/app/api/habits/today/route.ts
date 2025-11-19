import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const user = await authenticate(request);
    const userId = user._id; 

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const targetDate = dateParam ? new Date(dateParam) : new Date();
    
    const startOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), 23, 59, 59, 999);


    const todayIndex = targetDate.getDay(); 
    const habitsToday = await Habit.find({
      userId,
      [`days.${todayIndex}`]: true,
    }).populate("categoryId");

    const logsToday = await HabitLog.find({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay },
      });

    

    const habitsWithStatus = habitsToday.map((habit) => {
      const h = habit as any;
      const log = logsToday.find((l) => l.habitId.toString() === h._id.toString());
      return {
        _id: h._id.toString(),
        name: habit.name,
        description: habit.description,
        category: habit.categoryId,
        isDone: log ? log.isDone : false,    
    };  
        
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

