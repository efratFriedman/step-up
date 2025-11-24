import { Star } from "lucide-react";
import styles from "./Completed.module.css";
export default function CompletedCard({ value }: { value: number }) {
    return (
        <div className={styles.card}>
        <div className={styles.iconCircle}>
          <Star size={20} fill="white" stroke="none" />
        </div>
        <h2 className={styles.value}>{value}</h2>
        <p className={styles.label}>completed</p>
      </div>
    );
  }
  