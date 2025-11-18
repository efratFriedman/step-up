import { IHabit } from "@/interfaces/IHabit";
import { getUserHabits } from "@/services/habitsService";
import { getDayIndex } from "@/utils/date";
import { useEffect, useState } from "react";

export default function useHabitsForDay(userId: string, date: Date) {
  const [habitsForDay, setHabitsForDay] = useState<IHabit[]>([]);

  useEffect(() => {
    if (!userId || !date) return;

    async function load() {
      try {
        const habits = await getUserHabits(userId);
        const dayIndex = getDayIndex(date);
        const filtered = habits.filter(
          (h) => Array.isArray(h.days) && h.days[dayIndex]
        );
        setHabitsForDay(filtered);
      } catch (err) {
        console.error("useHabitsForDay error:", err);
      }
    }

    load();
  }, [userId, date]);

  return habitsForDay;
}
