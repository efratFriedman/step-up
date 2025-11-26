import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { authenticate } from "@/lib/server/authMiddleware";
import { startOfDayUTC, endOfDayUTC, toUTCDate } from "@/utils/date";

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
        const todayUTC = toUTCDate(new Date());
        const todayKey = todayUTC.toISOString().split("T")[0];
    
        const completedToday = logs.filter(log => {
          const logDateKey = toUTCDate(new Date(log.date)).toISOString().split("T")[0];
          return logDateKey === todayKey && log.isDone;
        }).length;

        console.log("Today Key:", todayKey, "Completed Today:", completedToday);
        
        const logsByDate: Record<string, any[]> = {};

        logs.forEach(log => {
          const dateKey = toUTCDate(new Date(log.date)).toISOString().split("T")[0];
          if (!logsByDate[dateKey]) logsByDate[dateKey] = [];
          logsByDate[dateKey].push(log);
        });

        let achievements = 0;
        let streak = 0;
        const habitCount = habits.length;

        if (habitCount === 0) {
          return NextResponse.json({
            dayStreak: 0,
            achievements: 0,
            completed,
            completedToday,
          });
        }

        const today = new Date();
        let currentStreakDate = todayKey;

        const sortedDates = Object.keys(logsByDate)
          .sort((a, b) => b.localeCompare(a));

        for (const dateKey of sortedDates) {
          const logsForDay = logsByDate[dateKey];
          const doneCount = logsForDay.filter(l => l.isDone).length;
          const isPerfectDay = doneCount === habitCount;

          if (isPerfectDay) {
            achievements++;
          }

          if (dateKey === currentStreakDate && isPerfectDay) {
            streak++;

            const prevDay = new Date(dateKey);
            prevDay.setUTCDate(prevDay.getUTCDate() - 1);
            currentStreakDate = prevDay.toISOString().split("T")[0];
          } else if (dateKey === currentStreakDate && !isPerfectDay) {
            break;
          }
        }

        console.log("dayStreak:", streak, "achievements:", achievements);

        return NextResponse.json({
          dayStreak: streak,
          achievements,
          completed,
          completedToday,
        });

    
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
        );
    }
}