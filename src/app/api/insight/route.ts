import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { authenticate } from "@/lib/server/authMiddleware";
import { toUTCDate } from "@/utils/date";

export async function GET(request: Request){
    try {
        await dbConnect();
    
        const userId = await authenticate(request);
        if (!userId) 
        return NextResponse.json(
            { error: "Unauthorized" }, 
            { status: 401 });
    
    
        // const habits = await Habit.find({ userId });    
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

        // let strongestHabit = null;
        // if (habits.length > 0) {
        //   const habitStats = habits.map(habit => {
        //     const habitLogsThisWeek = logs.filter(log => {
        //       const logDate = toUTCDate(new Date(log.date));
        //       return logDate >= startOfWeekUTC && 
        //              log.habitId.toString() === habit.id.toString() && 
        //              log.isDone;
        //     });

        //     const uniqueDays = new Set(
        //       habitLogsThisWeek.map(log => 
        //         toUTCDate(new Date(log.date)).toISOString().split("T")[0]
        //       )
        //     );

        //     return {
        //       habitId: habit._id,
        //       name: habit.name,
        //       daysCount: uniqueDays.size,
        //       totalCompletions: habitLogsThisWeek.length,
        //     };
        //   });

        //   habitStats.sort((a, b) => {
        //     if (b.daysCount !== a.daysCount) {
        //       return b.daysCount - a.daysCount;
        //     }
        //     if (b.totalCompletions !== a.totalCompletions) {
        //       return b.totalCompletions - a.totalCompletions;
        //     }
        //     return 0;
        //   });

        //   if (habitStats.length > 0 && habitStats[0].daysCount > 0) {
        //     strongestHabit = {
        //       name: habitStats[0].name,
        //       daysCount: habitStats[0].daysCount,
        //       totalCompletions: habitStats[0].totalCompletions,
        //     };
        //   }
        // }

    return NextResponse.json({
      completed,
      completedToday,
      completedThisWeek,
      // strongestHabit,
    });

    
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
        );
    }
}