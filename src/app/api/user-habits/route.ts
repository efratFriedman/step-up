import { dbConnect } from "@/lib/DB";
import Habit from "@/models/Habit";
import { NextResponse } from "next/server";
import { authenticate } from "@/lib/server/authMiddleware"; 

export async function GET(req: Request) {
    try {
        await dbConnect();

        const user = await authenticate(req);
        const userId = user._id;

        const habits = await Habit.find({
            userId: {
                $eq:userId,
                $ne:null,
                $exists:true,
            },
            
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
