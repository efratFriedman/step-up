import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
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

       
    return NextResponse.json({
      completed,
      completedToday,
      completedThisWeek,
    });

    
    } catch (error) {
        console.error("Error fetching insights:", error);
        return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
        );
    }
}