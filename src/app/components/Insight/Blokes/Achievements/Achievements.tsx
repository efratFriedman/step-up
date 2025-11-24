import { Medal } from "lucide-react";
import styles from "./Achievements.module.css";
export default function AchievementsCard({ value }: { value: number }) {
    return (
        <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <Medal size={28} strokeWidth={2.5} color="black" /> 
        </div>
        <h2 className={styles.value}>{value}</h2>
        <p className={styles.label}>Achievements</p>
      </div>
    );
  }
  