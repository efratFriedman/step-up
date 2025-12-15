"use client";

import { useEffect } from "react";
import { useHabitAppStore } from "@/app/store/habitAppStore/store";
import { useUserStore } from "@/app/store/useUserStore";
import { useOnboardingStore } from "@/app/store/useOnboardingStore";
import { getCategoryStyle } from "@/utils/todayHabitsHelper";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import styles from "./TodayHabits.module.css";
import Loader from "../../Loader/Loader";
import NoHabitsEmpty from "../NoTodayHabits/NoTodayHabits";

export default function TodayHabits({ selectedDate }: { selectedDate: Date }) {
  const todayHabits = useHabitAppStore((s) => s.todayHabits);
  const loading = useHabitAppStore((s) => s.loadingToday);
  const fetchTodayHabits = useHabitAppStore((s) => s.fetchTodayHabits);
  const toggleTodayStatus = useHabitAppStore((s) => s.toggleTodayStatus);
  const fetchLogs = useHabitAppStore((s) => s.fetchLogs);

  const user = useUserStore((s) => s.user);
  const isOnboardingActive = useOnboardingStore((s) => s.isOnboardingActive);

  const isToday = (() => {
    const today = new Date();
    return (
      today.getFullYear() === selectedDate.getFullYear() &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getDate() === selectedDate.getDate()
    );
  })();

  const fakeHabits: ITodayHabit[] = [
    {
      habitId: "fake-h1",
      logId: "fake-log1",
      name: "Creative Sketch",
      isDone: false,
      date: new Date().toISOString().split("T")[0],
      size: "small",
      category: {
        name: "Creativity",
        image: "https://img.icons8.com/ios-filled/100/757575/paint-palette.png",
        colorTheme: "#dda0dd",

      },
    },
    {
      habitId: "fake-h2",
      logId: "fake-log2",
      name: "Morning Stretch",
      isDone: false,
      date: new Date().toISOString().split("T")[0],
      size: "medium",
      category: {
        name: "Health",
        image: "https://img.icons8.com/ios-filled/100/757575/heart-with-pulse.png",
        colorTheme: "#ef9a9a"
      },
    },
    {
      habitId: "fake-habit-4",
      logId: "fake-log-4",
      name: "Study Session",
      description: "Read or practice for 10 minutes",
      isDone: false,
      date: new Date().toISOString().split("T")[0],
      size: "medium",
      category: {
        name: "Study",
        image: "https://img.icons8.com/ios-filled/100/757575/graduation-cap.png",
        colorTheme: "#183c5c"
      }
    },
    {
      habitId: "fake-habit-5",
      logId: "fake-log-5",
      name: "Daily Reflection",
      description: "Write one takeaway from today",
      isDone: false,
      date: new Date().toISOString().split("T")[0],
      size: "large",
      category: {

        name: "Self-Improvement",
        image: "https://img.icons8.com/ios-filled/100/757575/stairs-up.png",
        colorTheme: "#90caf9"
      }
    }
  ];


  const habitsToShow =
    isOnboardingActive && todayHabits.length === 0 ? fakeHabits : todayHabits;

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    fetchTodayHabits(dateStr);
  }, [selectedDate]);

  if (loading) return <Loader />;

  if (!habitsToShow.length) {
    return <NoHabitsEmpty isToday={isToday} />;
  }

  return (
    <div id="onboarding-today-habits" className={styles.habitsGrid}>
      {habitsToShow.map((habit: ITodayHabit, index: number) => {
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
              // ⭐ בזמן הדרכה — לא לשנות מצב אמיתי
              if (isOnboardingActive) return;

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
              {habit.category?.image && (
                <img
                  src={habit.category.image}
                  alt={habit.category.name}
                  className={styles.iconImage}
                />
              )}
            </div>

            <p className={styles.habitName}>{habit.name}</p>
          </div>
        );
      })}
    </div>
  );
}
