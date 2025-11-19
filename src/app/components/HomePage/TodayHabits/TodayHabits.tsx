"use client";

import { useEffect, useState } from "react";
import { getTodayHabits, updateHabitStatus } from "@/services/habitsService";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";

interface TodayHabitsProps {
  selectedDate: Date;
}

export default function TodayHabits({ selectedDate }: TodayHabitsProps) {
  const [habits, setHabits] = useState<ITodayHabit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHabitsForDate = async () => {
      setLoading(true);
      try {
        const data = await getTodayHabits(selectedDate);
        setHabits(data || []);
      } catch (error) {
        console.error("Error fetching habits:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHabitsForDate();
  }, [selectedDate]);

  const toggleHabitStatus = async (habitId: string) => {
    try {
      const updatedHabit = await updateHabitStatus(habitId, selectedDate);

      setHabits((prev) =>
        prev.map((habit) =>
          habit._id === habitId ? updatedHabit : habit
        )
      );
    } catch (error) {
      console.error("Error", error);
    }
  };
  if (loading) {
    return <div>Loading today's habits...</div>;
  }
  if (!habits || habits.length === 0) return <p>there are no habits for today</p>;

  return (
    <div>
      <ul>
        {habits.map(habit => (
          <li
            key={habit._id}
            style={{
              textDecoration: habit.isDone ? "line-through" : "none",
              opacity: habit.isDone ? 0.5 : 1,
              marginBottom: "10px",
            }}
          >
            <div>
              <strong>{habit.name}</strong>
              {habit.description && <p>{habit.description}</p>}
            </div>
            <button onClick={() => toggleHabitStatus(habit._id)}>
              {habit.isDone ? "not done" : "done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

}