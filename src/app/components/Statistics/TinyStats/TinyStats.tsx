"use client";

import { useEffect, useState } from "react";
import { summarizeStats, DailyStat } from "@/utils/statistics";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import RangeSelector from "../RangeSelector/RangeSelector";
import styles from "./TinyStats.module.css";

export default function TinyStats() {
    const [range, setRange] = useState<7 | 30 | 365>(7);

    const stats7 = useStatisticsStore(s => s.stats7);
    const stats30 = useStatisticsStore(s => s.stats30);
    const stats365 = useStatisticsStore(s => s.stats365);
    const fetchStatisticsFor = useStatisticsStore(s => s.fetchStatisticsFor);

    useEffect(() => {
        fetchStatisticsFor(range);
    }, [range]);

    const stats: DailyStat[] =
        range === 7 ? stats7 :
        range === 30 ? stats30 :
                       stats365;

    const summary = summarizeStats(stats);

    return (
        <div className={styles.container}>

            {/* מרכזת את הסלקטור */}
            <div className={styles.selectorWrapper}>
                <RangeSelector
                    value={range}
                    onChange={setRange}
                    options={[
                        { value: 7, label: "Weekly" },
                        { value: 30, label: "Monthly" },
                        { value: 365, label: "Yearly" },
                    ]}
                />
            </div>

            <div className={styles.statsContainer}>
                <div className={`${styles.card} ${styles.successCard}`}>
                    <div className={styles.cardIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardLabel}>Success Rate</div>
                        <div className={styles.cardValue}>{summary.successPercent}%</div>
                    </div>
                </div>

                <div className={`${styles.card} ${styles.completedCard}`}>
                    <div className={styles.cardIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardLabel}>Completed</div>
                        <div className={styles.cardValue}>{summary.completed}</div>
                    </div>
                </div>

                <div className={`${styles.card} ${styles.missedCard}`}>
                    <div className={styles.cardIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={styles.cardLabel}>Missed</div>
                        <div className={styles.cardValue}>{summary.missed}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
