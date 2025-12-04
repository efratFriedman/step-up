import { useHabitStore } from "@/app/store/useHabitStore";
import { getDayIndexUTC } from "@/utils/date";
import { useEffect } from "react";

export default function useHabitsForDay(userId: string, date: Date) {
  const { habits, fetchHabits } = useHabitStore();

  useEffect(() => {
    if (!userId || !date) return;
    fetchHabits(); 
  }, [userId, date, fetchHabits]);

  const dayIndex = getDayIndexUTC(date);
  return habits.filter(
    (h) => Array.isArray(h.days) && h.days[dayIndex]
  );
}
