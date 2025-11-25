import { dbConnect } from "@/lib/DB";
import { authenticate } from "@/lib/server/authMiddleware";
import HabitLog from "@/models/HabitLog";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ logId: string }> }
) {
    try {
        await dbConnect();

        const user = await authenticate(req);
        const { logId } = await params;

        const log = await HabitLog.findOne({
            _id: logId,
            userId: user._id
        });

        if (!log) {
            return NextResponse.json(
                { message: "HabitLog not found" },
                { status: 404 }
            );
        }

        log.isDone = !log.isDone;
        await log.save();

        return NextResponse.json(
            { isDone: log.isDone, logId: log._id.toString() },
            { status: 200 }
        );
    } catch (error) {
        console.error("PATCH /habit-logs error:", error);
        return NextResponse.json(
            { message: "Failed to update habit status" },
            { status: 500 }
        );
    }
}