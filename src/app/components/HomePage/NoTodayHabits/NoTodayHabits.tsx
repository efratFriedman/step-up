"use client";

import styles from "./NoTodayHabits.module.css";
import { useRouter } from "next/navigation";



export default function NoHabitsEmpty({ isToday }: { isToday: boolean }) {
  const router = useRouter();

 return (
    <div className={styles.wrapper}>
      <div className={styles.illustration}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle cx="75" cy="85" r="28" fill="#FFD369" className={styles.sun} />
          <rect x="20" y="100" width="110" height="10" rx="5" fill="#1d486a" opacity="0.2" />
          <g stroke="#FFD369" strokeWidth="4" strokeLinecap="round" opacity="0.7">
            <line x1="75" y1="35" x2="75" y2="20" />
            <line x1="50" y1="45" x2="40" y2="35" />
            <line x1="100" y1="45" x2="110" y2="35" />
          </g>
        </svg>
      </div>

      <h3 className={styles.title}>
        {isToday ? "Day starts clean ☀️" : "No habits on this date"}
      </h3>

      <p className={styles.text}>
        {isToday
          ? "This is a perfect moment to add a habit and build your routine."
          : "No habits were scheduled for this day. Want to add one?"}
      </p>

      <div className={styles.hintWrapper}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1d486a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.arrowIcon}
        >
          <path d="M12 19V5" />
          <path d="M5 12l7 7 7-7" />
        </svg>
        <p className={styles.hintText}>Press the + button</p>
        
      </div>
    </div>
  );
}
