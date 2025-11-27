"use client";

import styles from "./StrongestHabit.module.css";

interface StrongestHabitProps {
  habit: {
    name: string;
    daysCount: number;
    totalCompletions: number;
  } | null;
}

export default function StrongestHabit({ habit }: StrongestHabitProps) {
  if (!habit) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>💪</div>
          <h3 className={styles.emptyTitle}>Weekly Champion</h3>
          <p className={styles.emptyText}>Complete habits to see your strongest one!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Weekly Champion</h3>
      </div>
      <div className={styles.habitName}>{habit.name}</div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statValue}>{habit.daysCount}</div>
          <div className={styles.statLabel}>days</div>
        </div>
        <div className={styles.divider}>•</div>
        <div className={styles.stat}>
          <div className={styles.statValue}>{habit.totalCompletions}</div>
          <div className={styles.statLabel}>times</div>
        </div>
      </div>

      <div className={styles.badge}>🏆 Top Performer</div>
    </div>
  );
}