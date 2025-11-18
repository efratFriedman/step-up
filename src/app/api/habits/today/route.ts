import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import mongoose from "mongoose";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(request: Request) {
    try{
    await dbConnect();
    console.log("check sos", );


    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];

    if(!token){
        return NextResponse.json({message:"Missing token"},{status:401});
    }

    let decoded;
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET!);
    }catch(err){
        return NextResponse.json({message:"Invalid token"},{status:403});
    }

    
    let userId = (decoded as any).id;
    if (!userId) {
      return NextResponse.json({ message: "UserId missing in token" }, { status: 400 });
    }
    if (typeof userId !== "string") userId = userId.toString();
    console.log("🔍 User ID from token:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid user ID format" }, { status: 400 });
    }

    const objectUserId = new mongoose.Types.ObjectId(userId);

    // const userId = (decoded as any).userId;
    // if(!mongoose.Types.ObjectId.isValid(userId)){
    //     return NextResponse.json({message:"Invalid user ID format"},{status:400});
    // }

    const today = new Date();   
    const todayIndex = today.getDay();

    console.log("📅 Today is:", today.toLocaleString('he-IL')); // ← הוסיפי את זה
    console.log("📅 Day index:", todayIndex);

    const habitsToday = await Habit.find({
        userId: objectUserId,
        [`days.${todayIndex}`]: true,
      }).populate("categoryId");
  
      console.log("✅ Found habits:", habitsToday.length); // ← הוסיפי את זה
      console.log("📋 Habits details:", JSON.stringify(habitsToday, null, 2)); // ← הוסיפי את זה


      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    const logsToday = await HabitLog.find({
        userId: objectUserId,
        date: { $gte: startOfDay, $lte: endOfDay },
    });

    console.log("📝 Logs found:", logsToday.length); // ← הוסיפי את זה

    const habitsWithStatus = habitsToday.map(habit => {
        const log = logsToday.find(l => l.habitId.toString() === habit._id.toString());
        return {
            _id: habit._id.toString(),
            name: habit.name,
            description: habit.description,
            category: habit.categoryId,
            isDone: log ? log.isDone : false,
        };
    });
    console.log("🎯 Final habits with status:", habitsWithStatus); // ← הוסיפי את זה


    return NextResponse.json({habits: habitsWithStatus });
    }catch(error){
        console.error("GET /habits/today error:", error);
        return NextResponse.json(
            { message: "Failed to fetch today's habits" },
            { status: 500 }
        );
    }
}
