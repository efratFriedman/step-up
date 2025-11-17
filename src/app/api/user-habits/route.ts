import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json(
                { message: "userId is required" },
                { status: 400 }
            );
        }
        const habits = await Habit.find({
            userId,
        });
        return NextResponse.json(habits);
    }
    catch (error) {
        console.error("GET /user-habits error:", error);

        return NextResponse.json(
            { message: "Failed to fetch habits" },
            { status: 500 }
        );
    }
}