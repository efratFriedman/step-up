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
      try {
        const habitsForToday = await getTodayHabits(selectedDate);
        setHabits(habitsForToday); 
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHabitsForDate();
  }, [selectedDate]);
  
  const toggleHabitStatus = async (habitId: string) => {
    const updatedHabit = await updateHabitStatus(habitId, selectedDate);

    setHabits((prev) =>
      prev.map((h) => (h._id === habitId ? updatedHabit : h))
    );
  };

  const getHabitIcon = (habit: ITodayHabit) => {
    if (habit.category?.image) {
      return <img src={habit.category.image} alt={habit.category.name} className={styles.iconImage} />;
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
            key={habit._id}
            className={`${styles.habitCard} ${habit.isDone ? styles.isDone : ""} ${sizeClass} ${customClass}`}
            style={getCategoryStyle(habit)}
            onClick={() => toggleHabitStatus(habit._id)}
          >
            {habit.isDone && (
              <div className={styles.checkmark}>
                <span role="img" aria-label="done">✓</span>
              </div>
            )}
    
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
