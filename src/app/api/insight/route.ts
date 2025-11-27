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
       
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfWeekUTC = toUTCDate(startOfWeek);

        const completedThisWeek = logs.filter((log) => {
          const logDate = toUTCDate(new Date(log.date));
          return logDate >= startOfWeekUTC && log.isDone;
        }).length;
        console.log("Completed this week:", completedThisWeek);

        let strongestHabit = null;
        if (habits.length > 0) {
          const habitStats = habits.map(habit => {
            const habitLogsThisWeek = logs.filter(log => {
              const logDate = toUTCDate(new Date(log.date));
              return logDate >= startOfWeekUTC && 
                     log.habitId.toString() === habit.id.toString() && 
                     log.isDone;
            });

            const uniqueDays = new Set(
              habitLogsThisWeek.map(log => 
                toUTCDate(new Date(log.date)).toISOString().split("T")[0]
              )
            );

            return {
              habitId: habit._id,
              name: habit.name,
              daysCount: uniqueDays.size,
              totalCompletions: habitLogsThisWeek.length,
            };
          });

          habitStats.sort((a, b) => {
            if (b.daysCount !== a.daysCount) {
              return b.daysCount - a.daysCount;
            }
            if (b.totalCompletions !== a.totalCompletions) {
              return b.totalCompletions - a.totalCompletions;
            }
            return 0;
          });

          if (habitStats.length > 0 && habitStats[0].daysCount > 0) {
            strongestHabit = {
              name: habitStats[0].name,
              daysCount: habitStats[0].daysCount,
              totalCompletions: habitStats[0].totalCompletions,
            };
          }
        }


        const logsByDate: Record<string, any[]> = {};
        logs.forEach((log) => {
          const dateKey = toUTCDate(new Date(log.date))
            .toISOString()
            .split("T")[0];
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
            completedThisWeek: 0,
            strongestHabit: null,
          });
        }

        const currentStreakDate = todayKey;

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
      completedThisWeek,
      strongestHabit,
    });

    
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
        );
    }
}