import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(request: Request){
    try {
        await dbConnect();
    
        const userId = await authenticate(request);
        if (!userId) 
        return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 });
    
    
        const habits = await Habit.find({ userId });    
        const logs = await HabitLog.find({ userId })
        .sort({ date: -1 })
        .lean();
    
        const completed = logs.filter(l => l.isDone).length;

        const logsByDate: Record<string, any[]> = {};
        logs.forEach(log => {
            const dateKey = log.date.toISOString().split('T')[0];
            if (!logsByDate[dateKey]) {
                logsByDate[dateKey] = [];
            }
            logsByDate[dateKey].push(log);
        });

        let achievements = 0;
        let streak = 0;

        const today = new Date().toISOString().split("T")[0];
        let currentStreakDate = today;
        const habitCount = habits.length;

        for (const dateKey of Object.keys(logsByDate).sort().reverse()) {
            const logsForDay = logsByDate[dateKey];
            const doneCount = logsForDay.filter(l => l.isDone).length;
            const isPerfectDay = doneCount === habitCount;
      
            if (isPerfectDay) 
                achievements++;
            if (dateKey === currentStreakDate && isPerfectDay) {
              streak++;
              const prev = new Date(dateKey);
              prev.setDate(prev.getDate() - 1);
              currentStreakDate = prev.toISOString().split("T")[0];
            }
          }

          return NextResponse.json({
            dayStreak: streak,
            achievements,
            completed,
          });

    
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
        );
    }
}