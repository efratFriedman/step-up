import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(request: Request) {
    try{
    await dbConnect();

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
    
    const userId = (decoded as any).userId;
    if(!mongoose.Types.ObjectId.isValid(userId)){
        return NextResponse.json({message:"Invalid user ID format"},{status:400});
    }

    const today = new Date();   
    const todayIndex = today.getDay();

    const habitsToday = await Habit.find({
        userId: new mongoose.Types.ObjectId(userId),
        [`days.${todayIndex}`]: true,
    }).populate("categoryId");

    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const logsToday = await HabitLog.find({
        userId: userId,
        date: { $gte: startOfDay, $lte: endOfDay },
    });

    const habitsWithStatus = habitsToday.map(habit => {
        const log = logsToday.find(l => l.habitId.toString() === habit._id.toString());
        return {
            _id: habit._id,
            name: habit.name,
            description: habit.description,
            category: habit.categoryId,
            isDone: log ? log.isDone : false,
        };
    });

    return NextResponse.json({habits: habitsWithStatus });
    }catch(error){
        console.error("GET /habits/today error:", error);
        return NextResponse.json(
            { message: "Failed to fetch today's habits" },
            { status: 500 }
        );
    }
}