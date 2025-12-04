import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import { endOfDayUTC, startOfDayUTC } from "@/utils/date";
import mongoose from "mongoose";

type PopulatedCategory = {
    _id: string;
    name: string;
    image?: string;
    colorTheme?: string;
};

export async function getHabitsByDateService(userId: string, date: Date) {
    const weekday = date.getUTCDay();
    const start = startOfDayUTC(date);
    const end = endOfDayUTC(date);

    const habits = await Habit.find({ userId }).populate("categoryId");

    const result: any[] = [];

    for (const habit of habits) {
        const shouldRunToday = habit.days?.[weekday] ?? false;
        if (!shouldRunToday) continue;

        let log = await HabitLog.findOne({
            habitId: habit._id,
            userId,
            date: {
                $gte: startOfDayUTC(date),
                $lt: endOfDayUTC(date)
            }
        });

        if (!log) {
            log = await HabitLog.create({
                habitId: habit._id,
                userId: userId,
                date: start,
                isDone: false,
            });
        }

        const category = habit.categoryId as unknown as PopulatedCategory;

        result.push({
            habitId: habit._id?.toString(),
            logId: log._id?.toString(),
            name: habit.name,
            description: habit.description,
            category: habit.categoryId ? {
                name: category.name,
                image: category.image,
                colorTheme: category.colorTheme
            } : null,
            reminderTime: habit.reminderTime,
            isDone: log.isDone,
            date: log.date
        });
    }
    return result;
}

export async function deleteHabitWithFutureLogs(
    habitId: string,
    userId: string
) {
    if (!mongoose.Types.ObjectId.isValid(habitId)) {
        throw new Error("Invalid habit ID");
    }

    const objectId = new mongoose.Types.ObjectId(habitId);
    const userIdObjectId = typeof userId === 'string' 
        ? new mongoose.Types.ObjectId(userId) 
        : userId;

    // Delete the habit
    const deleteResult = await Habit.deleteOne({ _id: objectId, userId: userIdObjectId });

    if (deleteResult.deletedCount === 0) {
        throw new Error("Habit not found or already deleted");
    }

    // Delete future logs
    const today = startOfDayUTC(new Date());
    const logsDeleteResult = await HabitLog.deleteMany({
        habitId: objectId,
        userId: userIdObjectId,
        date: { $gte: today },
    });

    return { 
        ok: true,
        deletedCount: deleteResult.deletedCount,
        logsDeletedCount: logsDeleteResult.deletedCount
    };
}

export async function updateHabitWithFutureLogs(
    habitId: string,
    userId: string,
    data: any
) {
    const objectId = new mongoose.Types.ObjectId(habitId);

    const updated = await Habit.findOneAndUpdate(
        {
            _id: objectId,
            userId
        },
        data,
        { new: true }
    );

    if (!updated) throw new Error("Habit not found");

    const today = startOfDayUTC(new Date());

    const futureLogs = await HabitLog.find({
        habitId: objectId,
        userId,
        date: { $gte: today }
    });

    for (const log of futureLogs) {
        const logDate = new Date(log.date);
        const dayIndex = logDate.getDay();

        const shouldExist = updated.days[dayIndex];

        if (!shouldExist) {
            await HabitLog.deleteOne({ _id: log.id});
        }
    }

    return updated;
}