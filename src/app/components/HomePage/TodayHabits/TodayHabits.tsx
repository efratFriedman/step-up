"use client";

import { useEffect } from "react";
import { useTodayHabitStore } from "@/app/store/useTodayHabitStore";
import { useHabitLogStore } from "@/app/store/useHabitLogStore";
import { useUserStore } from "@/app/store/useUserStore";
import { getCategoryStyle } from "@/utils/todayHabitsHelper";
import { toUTCDate } from "@/utils/date";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";

export default function TodayHabits({ selectedDate }: { selectedDate: Date }) {
  const {
    habits,
    loading,
    fetchTodayHabits,
    toggleStatus
  } = useTodayHabitStore();
  const user=useUserStore((state)=>state.user);
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
    fetchTodayHabits(clean);
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

  if (loading) return <p>Loading...</p>;
  if (!habits?.length) return <p>No habits for this day</p>;

  return (
    <div className={styles.habitsGrid}>
      {habits.map((habit: ITodayHabit, index: number) => {
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
              await toggleStatus(habit.logId);

              const userId = user?.id;
              const dateIso = selectedDate.toISOString();
              if (userId) {
                const fetchLogs = useHabitLogStore.getState().fetchLogs;
                await fetchLogs(userId, dateIso);
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
