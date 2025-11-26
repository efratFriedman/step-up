import { dbConnect } from "@/lib/DB";
import { authenticate } from "@/lib/server/authMiddleware";
import { getHabitsByDateService } from "@/services/server/habitService";
import { NextResponse } from "next/server";

import "@/models/Category";
import "@/models/Habit";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const user = await authenticate(req);
        const userId = user._id;

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get("date");
        if (!dateParam) {
            return NextResponse.json(
                { message: "date is required" },
                { status: 400 }
            );
        }

        const date = new Date(dateParam);


        const dailyHabits = await getHabitsByDateService(userId, date);

        return NextResponse.json(dailyHabits, { status: 200 });


    } catch (error) {
        console.error("GET /api/habits/by-date error:", error);
        return NextResponse.json({ message: "server error" }, { status: 500 });
    }

} 