import useHabitsForDay from "./useHabitsForDay";
import useHabitLogForDay from "./useHabitLogForDay";

export default function useProgress(userId: string, date: Date) {
    const habits = useHabitsForDay(userId, date);
    const logs = useHabitLogForDay(userId, date);

    const total = habits.length;
    const done = Array.isArray(logs)
        ? logs.filter(log => log.isDone).length
        : 0;
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    return {
        total,
        done,
        percent,
        habits,
        logs,
    };
}