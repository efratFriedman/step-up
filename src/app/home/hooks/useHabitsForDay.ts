import { useHabitAppStore } from "@/app/store/habitAppStore/store";
import { getDayIndexUTC } from "@/utils/date";
import { useEffect } from "react";

export default function useHabitsForDay(userId: string, date: Date) {
  const habits = useHabitAppStore((s) => s.habits);
  const fetchHabits = useHabitAppStore((s) => s.fetchHabits);

  useEffect(() => {
    if (!userId || !date) return;
    fetchHabits();
  }, [userId]);

  const dayIndex = getDayIndexUTC(date);

  return habits.filter(
    (h) => Array.isArray(h.days) && h.days[dayIndex]
  );
}
