import { IHabit } from "@/interfaces/IHabit";
import { useHabitStore } from "@/app/store/useHabitStore";
import { getDayIndex } from "@/utils/date";
import { useEffect, useMemo } from "react";

export default function useHabitsForDay(userId: string, date: Date) {
  const { habits, fetchHabits } = useHabitStore();

  useEffect(() => {
    if (!userId || !date) return;
    fetchHabits();
  }, [userId, date]);

  const habitsForDay = useMemo(() => {
    if (!date || !Array.isArray(habits)) return [];

    const dayIndex = getDayIndex(date);
    return habits.filter(
      (h) => Array.isArray(h.days) && h.days[dayIndex]
    );
  }, [habits, date]);


  return habitsForDay;
}
