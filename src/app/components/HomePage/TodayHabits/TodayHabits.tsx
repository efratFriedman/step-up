"use client";

import { useEffect } from "react";
import { useHabitAppStore } from "@/app/store/habitAppStore/store";
import { useUserStore } from "@/app/store/useUserStore";
import { getCategoryStyle } from "@/utils/todayHabitsHelper";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";
import Loader from "../../Loader/Loader";
import NoTodayHabits from "../NoTodayHabits/NoTodayHabits";
import NoHabitsEmpty from "../NoTodayHabits/NoTodayHabits";

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
  if (!todayHabits?.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIllustration}>
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="40" y="80" width="120" height="80" rx="8" fill="#F3F4F6" />
            <rect x="60" y="100" width="80" height="20" rx="4" fill="#E5E7EB" />
            <rect x="60" y="130" width="60" height="20" rx="4" fill="#E5E7EB" />
            <circle cx="140" cy="50" r="30" fill="#DDD6FE" opacity="0.6" />
            <path d="M130 45 L135 50 L145 40" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <h3 className={styles.emptyTitle}>No habits for this day</h3>
        <p className={styles.emptyDescription}>
          {isToday
            ? "Start building your daily routine by adding habits"
            : "No habits were scheduled for this date"}
        </p>
      </div>
    );
  }
  
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
