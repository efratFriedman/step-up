"use client";
import { startOfDay } from "@/utils/date";
import { useState } from "react";
import styles from "./ProgressBar.module.css";
import useProgress from "@/app/home/hooks/useProgress";
import { useUserStore } from "@/app/store/useUserStore";

export default function ProgressBar() {
    const { user } = useUserStore();
    const userId = user?.id;
    const [today] = useState(() => {
        const d = new Date();
        return startOfDay(d);
    });
    const { total, done, percent } = useProgress(userId || "", today);

    if (!userId) {
        return <p>Loading...</p>;
    }

    const getEncouragingMessage = (percentage: number) => {
        if (percentage === 0) return "Let's start your day strong!";
        if (percentage < 25) return "Great start! Keep going!";
        if (percentage < 50) return "You're making progress!";
        if (percentage < 75) return "You're doing amazing!";
        if (percentage < 100) return "You're almost done!";
        return "Perfect! You crushed it today! 🎉";
    };

    const frameColor = "#a9a9a9";
    const progressColor = "#2e72ac";

    return (
        <div className={styles.container}>
            <div className={styles.progressCard}>
                <div className={styles.textSection}>
                    <p className={styles.encouragement}>{getEncouragingMessage(percent)}</p>
                    <div className={styles.habitCount}>
                        <span className={styles.done}>{done}</span>
                        <span className={styles.separator}>/</span>
                        <span className={styles.total}>{total}</span>
                    </div>
                    <p className={styles.label}>Habits</p>
                </div>
                <div className={styles.circularProgress}>
                    <svg className={styles.progressRing} width="120" height="120">
                        <circle
                            className={styles.progressRingCircle}
                            stroke={frameColor}
                            strokeWidth="10"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                        />
                        <circle
                            className={styles.progressRingCircleActive}
                            stroke={progressColor}
                            strokeWidth="10"
                            fill="transparent"
                            r="52"
                            cx="60"
                            cy="60"
                            style={{
                                strokeDasharray: `${2 * Math.PI * 52}`,
                                strokeDashoffset: `${2 * Math.PI * 52 * (1 - percent / 100)}`
                            }}
                        />
                    </svg>
                    <div className={styles.percentText}>{percent}%</div>
                </div>
            </div>
        </div>
    );
}