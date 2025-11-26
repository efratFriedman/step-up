import Habit from "@/models/Habit";
import HabitLog from "@/models/HabitLog";
import Category from "@/models/Category";
import { endOfDayUTC, startOfDayUTC } from "@/utils/date";

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