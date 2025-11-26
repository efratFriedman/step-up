"use client";

import { useState } from "react";
import useProgress from "@/app/home/hooks/useProgress";
import { useUserStore } from "@/app/store/useUserStore";
import { getEncouragingMessage } from "@/utils/progressHabit";
import styles from "./ProgressBar.module.css";
import { startOfDayUTC } from "@/utils/date";

export default function ProgressBar() {
    const { user } = useUserStore();
    const userId = user?.id!;

    const [today] = useState(() => startOfDayUTC(new Date()));
    const { total, done, percent } = useProgress(userId, today);

    if (!userId) {
        return <p>Loading...</p>;
    }

    const frameColor = "#a9a9a9";
    const progressColor = "#2e72ac";

    return (
        <div className={styles.container}>
            <div className={styles.progressCard}>
                <div className={styles.textSection}>
                    <p className={styles.encouragement}>
                        {getEncouragingMessage(percent)}
                    </p>

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
                            r="45"
                            cx="60"
                            cy="60"
                            style={{
                                strokeDasharray: `${2 * Math.PI * 45}`,
                                strokeDashoffset: `${2 * Math.PI * 45 * (1 - percent / 100)}`
                            }}
                        />
                    </svg>

                    <div className={styles.percentText}>{percent}%</div>
                </div>
            </div>
        </div>
    );
}
