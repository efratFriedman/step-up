"use client";

import { useEffect, useState } from "react";
import { getHabitsByDate } from "@/services/client/habitsService";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";
import { toUTCDate } from "@/utils/date";
import { updateHabitStatus } from "@/services/client/habitLogService";
import { useHabitStore } from "@/app/store/useHabitStore";

export default function TodayHabits({ selectedDate }: { selectedDate: Date }) {
  const storeHabits = useHabitStore((state) => state.habits); 
  const [habits, setHabits] = useState<ITodayHabit[]>([]);
  const [loading, setLoading] = useState(true);

  const isToday = (() => {
    const today = new Date();
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  })();

  useEffect(() => {
    const clean = toUTCDate(selectedDate);
    const fetchHabitsForDate = async () => {
      setLoading(true);
      try {
        const todaysHabits = await getHabitsByDate(clean);
        setHabits(todaysHabits);
      } catch (err) {
        console.error("Error loading today habits:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitsForDate();
  }, [selectedDate,storeHabits]);

  const toggleHabitStatus = async (logId: string) => {
    if (!isToday) return;
    try {
      const updatedHabit = await updateHabitStatus(logId);
      setHabits(prev =>
        prev.map(h =>
          h.logId === logId ? { ...h, isDone: updatedHabit.isDone } : h
        )
      );
    } catch (err) {
      console.error("Failed updating habit", err);
    }
  };

  const getHabitIcon = (habit: ITodayHabit) => {
    if (habit.category?.image) {
      return (
        <img
          src={habit.category.image}
          alt={habit.category.name}
          className={styles.iconImage}
        />
      );
    }
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const color = hex.replace('#', '');
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getCategoryStyle = (habit: ITodayHabit) => {
    const originalColor = habit.category?.colorTheme || "#f3f4f6";
    const pastelColor = hexToRgba(originalColor, 0.45);
    return {
      backgroundColor: pastelColor,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  };

  if (loading) return <p>Loading...</p>;
  if (!habits?.length) return <p>No habits for this day</p>;

  return (
    <div className={styles.habitsGrid}>
      {habits.map((habit, index) => {
        const sizeClass = habit.size ? styles[`height-${habit.size}`] : "";
        const customClass = index === 0 ? styles["span-two-rows"] : "";

        return (
          <div
            key={habit.logId}
            className={`
              ${styles.habitCard} 
              ${habit.isDone ? styles.isDone : ""} 
              ${sizeClass} 
              ${customClass}
              ${!isToday ? styles.readOnly : ""}  // ❗ במצב לא היום
            `}
            style={getCategoryStyle(habit)}
            onClick={() => toggleHabitStatus(habit.logId)}
          >
            <div className={styles.statusCircle}>
              {habit.isDone && <span className={styles.checkmark}>✓</span>}
            </div>

            <div className={styles.iconWrapper}>
              {getHabitIcon(habit)}
            </div>

            <p className={styles.habitName}>{habit.name}</p>
          </div>
        );
      })}
    </div>
  );
}
