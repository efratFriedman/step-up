import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Category from "@/models/Category";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(request: Request) {
  try {
    await dbConnect();

    const user = await authenticate(request);
    if (!user || !user._id) {
      return NextResponse.json(
        { message: "Unauthorized - please log in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      return NextResponse.json(
        { message: "Date parameter is required" },
        { status: 400 }
      );
    }
    
    const [year, month, day] = dateParam.split('-').map(Number);
    
    if (!year || !month || !day) {
      return NextResponse.json(
        { message: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const localDate = new Date(year, month - 1, day, 12, 0, 0); 
    const todayIndex = localDate.getDay();

    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    const habitsToday = await Habit.find({
      userId: user._id,
      [`days.${todayIndex}`]: true,
    }).populate("categoryId");
    

    const logsToday = await HabitLog.find({
        userId: user._id,
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

    return NextResponse.json(habitsWithStatus);

  } catch (error: any) {
   console.error("GET /habits/today error:", error);
    console.error("Error stack:", error.stack); 
    return NextResponse.json(
      { message: error.message || "Failed to fetch today's habits" },
      { status: 500 }
    );
  }
}

