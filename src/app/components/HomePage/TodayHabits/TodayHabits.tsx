"use client";

import { useEffect } from "react";
import { useHabitAppStore } from "@/app/store/habitAppStore/store"; 
import { useUserStore } from "@/app/store/useUserStore";
import { getCategoryStyle } from "@/utils/todayHabitsHelper";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";
import Loader from "../../Loader/Loader";

export default function TodayHabits({ selectedDate }: { selectedDate: Date }) {
  const todayHabits = useHabitAppStore((s) => s.todayHabits);
  const loading = useHabitAppStore((s) => s.loadingToday);
  const fetchTodayHabits = useHabitAppStore((s) => s.fetchTodayHabits);
  const toggleTodayStatus = useHabitAppStore((s) => s.toggleTodayStatus);

  const fetchLogs = useHabitAppStore((s) => s.fetchLogs); 
  const user = useUserStore((s) => s.user);

  const isToday = (() => {
    const today = new Date();
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  })();

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    fetchTodayHabits(dateStr);
  }, [selectedDate]);

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

  if (loading) return <Loader />;
  if (!todayHabits?.length) return <p>No habits for this day</p>;

  return (
    <div className={styles.habitsGrid}>
      {todayHabits.map((habit: ITodayHabit, index: number) => {
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
              ${!isToday ? styles.readOnly : ""}
            `}
            style={getCategoryStyle(habit)}
            onClick={async () => {
              if (!isToday) return;

              await toggleTodayStatus(habit.logId);

              if (user?.id) {
                const iso = selectedDate.toISOString();
                await fetchLogs(user.id, iso);
              }
            }}
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
