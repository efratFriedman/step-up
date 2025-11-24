import { Flame } from "lucide-react";
import styles from "./DayStreak.module.css";

export default function DayStreakCard({ value }: { value: number }) {
    return (
        <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Flame size={28} strokeWidth={2.5} color="black" fill="transparent" />
        </div>
        <h2 className={styles.value}>{value} Days</h2>
        <p className={styles.label}>streak</p>
      </div>
    );
  }
  