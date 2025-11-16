import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import mongoose from "mongoose";
import "@/models/User"; 
import "@/models/Category"; 
import { habitSchema } from "@/lib/validation/habitValidation";
import jwt from "jsonwebtoken";


export async function GET() {
  try {
    await dbConnect();
    const habits = await Habit.find().populate("userId").populate("categoryId");
    return NextResponse.json(habits);
  } catch (error) {
    console.error("GET /habits error:", error);
    return NextResponse.json(
      { message: "Failed to fetch habits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const cookieHeader = request.headers.get("cookie");
    const token = cookieHeader?.split(";").find((c) => c.trim().startsWith("token="))?.split("=")[1];
    if (!token) {
      return NextResponse.json({ message: "Missing token" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    }catch(err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 403 });
    }


    const body = await request.json();

     const parsed = habitSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const { userId, name, description, categoryId, reminderTime, days } = body;
    if (!userId || !name) {
      return NextResponse.json(
        { message: "userId and name are required" },
        { status: 400 }
      );
    }
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ message: "Invalid userId" }, { status: 400 });
    }
    
    if (categoryId && !mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json({ message: "Invalid categoryId" }, { status: 400 });
    }


    const newHabit = await Habit.create({
      userId: new mongoose.Types.ObjectId(userId),  
      name,
      description,
      categoryId: categoryId ? new mongoose.Types.ObjectId(categoryId) : undefined,
      reminderTime,
      days,
    });


    return NextResponse.json(newHabit, { status: 201 });
  } catch (error) {
    console.error("POST /habits error:", error);
    return NextResponse.json(
      { message: "Failed to create habit" },
      { status: 500 }
    );
  }
}
