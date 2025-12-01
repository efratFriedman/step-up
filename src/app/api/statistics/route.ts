import { dbConnect } from "@/lib/DB";
import { authenticate } from "@/lib/server/authMiddleware";
import Category from "@/models/Category";
import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { SendingValidDate } from "@/utils/date";
import { buildCategoryBreakdown, buildDailyStatsForRange } from "@/utils/statistics";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const user = await authenticate(req);
        const userId = user._id;

        const { searchParams } = new URL(req.url);
        const rangeParam = searchParams.get("range");

        if (!rangeParam) {
            return NextResponse.json(
                { message: "range is required (7, 30, 365)" },
                { status: 400 }
            );
        }
        const range = Number(rangeParam);
        if (![7, 30, 365].includes(range)) {
            return NextResponse.json(
                { message: "range must be 7, 30 or 365" },
                { status: 400 }
            );
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (range - 1));

        const start = SendingValidDate(startDate.toISOString().slice(0, 10));
        const end = SendingValidDate(endDate.toISOString().slice(0, 10));

        const habits = await Habit.find({ userId });

        const logs = await HabitLog.find({
            userId,
            date: { $gte: start, $lte: end },
        });

        const dailyStats = buildDailyStatsForRange(habits, logs, start, end);

        const categories = await Category.find();
        const categoryStats = buildCategoryBreakdown(
            habits,
            logs,
            categories,
            start,
            end
        );
        return NextResponse.json(
            {
                range,
                stats: dailyStats,
                categories: categoryStats,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/statistics error:", error);
        return NextResponse.json(
            { message: "Failed to generate statistics" },
            { status: 500 }
        );
    }
}