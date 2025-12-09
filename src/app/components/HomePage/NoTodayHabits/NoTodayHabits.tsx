"use client";

import styles from "@/app/components/HomePage/NoTodayHabits/NoTodayHabits.module.css";

interface Props {
  isToday: boolean;
}

export default function NoHabitsEmpty({ isToday }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        {/* Sunrise illustration */}
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="85" r="28" fill="#FFD369" className={styles.sun} />

          <rect x="20" y="100" width="110" height="10" rx="5" fill="#1d486a" opacity="0.2" />

          <g stroke="#FFD369" stroke-width="4" stroke-linecap="round" opacity="0.7">
            <line x1="75" y1="35" x2="75" y2="20" />
            <line x1="50" y1="45" x2="40" y2="35" />
            <line x1="100" y1="45" x2="110" y2="35" />
          </g>
        </svg>
      </div>

      <h3 className={styles.title}>
        {isToday ? "No habits scheduled for today" : "No habits for this date"}
      </h3>

      <p className={styles.text}>
        {isToday
          ? "Start fresh and add a new habit to your daily routine."
          : "No habits were planned for the selected day."}
      </p>
    </div>
  );
}
