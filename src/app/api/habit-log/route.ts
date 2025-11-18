import { dbConnect } from "@/lib/DB";
import HabitLog from "@/models/HabitLog";
import { endOfDay, startOfDay } from "@/utils/date";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const dateParam = searchParams.get("date");

        if (!userId || !dateParam) {
            return NextResponse.json(
                { message: "userId and date are required" },
                { status: 400 }
            );
        }

        const date = new Date(dateParam);

        const start = startOfDay(date);
        const end = endOfDay(date);

        const logs = await HabitLog.find({
            userId,
            date: {
                $gte: start,
                $lte: end
            }
        });
        return NextResponse.json(logs);

    }
    catch (error) {
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
        const body = await req.json();

        const newLog = await HabitLog.create(body);

        return NextResponse.json(newLog);
    } catch (err) {
        console.error("POST /api/habit-log error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
