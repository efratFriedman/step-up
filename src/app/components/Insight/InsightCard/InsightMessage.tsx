"use client";

import { useInsightStore } from "@/app/store/useInsightStore";
import { getInsightMessage } from "@/utils/insightMessage";
import styles from "./InsightMessage.module.css";

export default function InsightMessage() {
    const { dayStreak, completedToday  } = useInsightStore();
    const message = getInsightMessage(dayStreak, completedToday );

    return (
        <div className={styles.card}>
            <p className={styles.header}>Habit Coach Says:</p>
          <p className={styles.text}>{message}</p>
        </div>
      );
}