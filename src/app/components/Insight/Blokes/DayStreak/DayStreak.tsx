"use client";

import { Trophy } from "lucide-react";
import styles from "./DayStreak.module.css";

interface LongestStreakCardProps {
  value: number;
}

export default function DayStreakCard({ value }: LongestStreakCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Trophy className={styles.icon} />
        {/* <h3 className={styles.title}>Personal Best</h3> */}
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>
          {value === 1 ? "day" : "days"} streak
        </div>
      </div>
      {value > 0 && (
        <div className={styles.badge}>🏆 All-Time Record</div>
      )}
    </div>
  );
  }
  