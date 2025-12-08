import { ICategory } from "@/interfaces/ICategory";
import { IHabit } from "@/interfaces/IHabit";
import { IHabitLog } from "@/interfaces/IHabitLog";

export interface DailyStat {
    date: string;
    expected: number;
    completed: number;
    missed: number;
    percent: number;

}

export interface RawDayData {
    dateKey: string;
    weekday: number;
    habitsForDay: IHabit[];
    logsForDay: IHabitLog[];
}
export function buildRawDailyData(
    habits: IHabit[],
    logs: IHabitLog[],
    start: Date,
    end: Date
): RawDayData[] {

    const logsByDate = new Map<string, IHabitLog[]>();

    for (const log of logs) {
        const key = new Date(log.date).toISOString().slice(0, 10);
        if (!logsByDate.has(key)) logsByDate.set(key, []);
        logsByDate.get(key)!.push(log);
    }

    const result: RawDayData[] = [];
    const current = new Date(start);

    while (current <= end) {
        const dateKey = current.toISOString().slice(0, 10);
        const weekday = current.getDay();

        const habitsForDay = habits.filter(
            (h) => Array.isArray(h.days) && h.days[weekday] === true
        );

        const logsForDay = logsByDate.get(dateKey) ?? [];

        result.push({
            dateKey,
            weekday,
            habitsForDay,
            logsForDay
        });

        current.setDate(current.getDate() + 1);
    }

    return result;
}
export function buildDailyStatsForRange(
    habits: IHabit[],
    logs: IHabitLog[],
    start: Date,
    end: Date
): DailyStat[] {

    const raw = buildRawDailyData(habits, logs, start, end);

    return raw.map((day) => {
        const expected = day.habitsForDay.length;
        const completed = day.logsForDay.filter((l) => l.isDone).length;

        return {
            date: day.dateKey,
            expected,
            completed,
            missed: Math.max(expected - completed, 0),
            percent: expected === 0 ? 0 : Math.round((completed / expected) * 100),
        };
    });
}



export function summarizeStats(stats: DailyStat[]) {
    const expected = stats.reduce((acc, d) => acc + d.expected, 0);
    const completed = stats.reduce((acc, d) => acc + d.completed, 0);
    const missed = stats.reduce((acc, d) => acc + d.missed, 0);


    const successPercent =
        expected === 0 ? 0 : Math.round((completed / expected) * 100);

    return {
        expected,
        completed,
        missed,
        successPercent,
    };
}

export function buildCategoryBreakdown(
    habits: IHabit[],
    logs: IHabitLog[],
    categories: ICategory[],
    start: Date,
    end: Date
) {
    const raw = buildRawDailyData(habits, logs, start, end);

    const map = new Map<string, { total: number; done: number }>();

    for (const day of raw) {
        for (const habit of day.habitsForDay) {
            const catId = habit.categoryId.toString();

            if (!map.has(catId)) {
                map.set(catId, { total: 0, done: 0 });
            }

            const entry = map.get(catId)!;
            entry.total++;

            const isDone = day.logsForDay.some(
                (l) => l.habitId.toString() === habit.id.toString() && l.isDone
            );


            if (isDone) entry.done++;
        }
    }

    return Array.from(map.entries()).map(([catId, data]) => {

        const cat = categories.find(
            (c) => c._id.toString() === catId.toString()
        );

        return {
            categoryId: catId,
            name: cat?.name ?? "Unknown",
            color: cat?.colorTheme ?? "#ccc",
            total: data.total,
            done: data.done,
            percent:
                data.total === 0 ? 0 : Math.round((data.done / data.total) * 100),
        };
    });
}
