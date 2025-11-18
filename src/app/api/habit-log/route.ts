import { dbConnect } from "@/lib/DB";
import HabitLog from "@/models/HabitLog";
import { endOfDay, startOfDay } from "@/utils/date";
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/server/authMiddleware";  

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
        const start = startOfDay(date);
        const end = endOfDay(date);

        const logs = await HabitLog.find({
            userId: userId,
            date: { $gte: start, $lte: end }
        });

        return NextResponse.json(logs);

    } catch (error) {
        console.error("GET /habit-log error:", error);

        return NextResponse.json(
            { message: "Failed to fetch logs" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();

        const user = await authenticate(req);
        const userId = user._id;

        const body = await req.json();

        const newLog = await HabitLog.create({
            ...body,
            userId: userId,   
        });

        return NextResponse.json(newLog);

    } catch (err) {
        console.error("POST /api/habit-log error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
