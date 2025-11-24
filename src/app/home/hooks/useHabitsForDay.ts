import { useHabitStore } from "@/app/store/useHabitStore";
import { IHabit } from "@/interfaces/IHabit";
import { getUserHabits } from "@/services/client/habitsService";
import { getDayIndexUTC } from "@/utils/date";
import { useEffect, useState } from "react";

export default function useHabitsForDay(userId: string, date: Date) {
  const { habits, fetchHabits } = useHabitStore();

  useEffect(() => {
    if (!userId || !date) return;

    if (habits.length === 0) {
      fetchHabits();
    }
  }, [userId, date]);


  const dayIndex = getDayIndexUTC(date);
  return habits.filter(
    (h) => Array.isArray(h.days) && h.days[dayIndex]
  );
}
