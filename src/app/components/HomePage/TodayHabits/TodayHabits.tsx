"use client";

import { useEffect, useState } from "react";
import { getTodayHabits, updateHabitStatus } from "@/services/habitsService";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";

export default function TodayHabits({ selectedDate }: { selectedDate: Date }) {
  const [habits, setHabits] = useState<ITodayHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabitsForDate = async () => {
      setLoading(true);
      const data = await getTodayHabits(selectedDate);
      setHabits(data || []);
      setLoading(false);
    };

    fetchHabitsForDate();
  }, [selectedDate]);

  const toggleHabitStatus = async (habitId: string) => {
    const updatedHabit = await updateHabitStatus(habitId, selectedDate);

    setHabits((prev) =>
      prev.map((h) => (h._id === habitId ? updatedHabit : h))
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!habits?.length) return <p>No habits for this day</p>;

  return (
    <ul>
      {habits.map((habit) => (
        <li key={habit._id}>
          <strong>{habit.name}</strong>
          <button onClick={() => toggleHabitStatus(habit._id)}>
            {habit.isDone ? "Undo" : "Done"}
          </button>
        </li>
      ))}
    </ul>
  );
}
