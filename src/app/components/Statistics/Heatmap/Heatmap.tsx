"use client";

import { useEffect } from "react";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import { DailyStat } from "@/utils/statistics";
import styles from "./Heatmap.module.css";

export default function Heatmap() {
  const RANGE = 365;

  const { stats365, loading, fetchStatisticsFor } = useStatisticsStore();

  useEffect(() => {
    fetchStatisticsFor(RANGE);
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>Loading yearly heatmap…</p>
      </div>
    );
  }

  if (!stats365.length) {
    return (
      <div className={styles.container}>
        <p className={styles.noData}>No data for the past year.</p>
      </div>
    );
  }

  const getColorClass = (percent: number) => {
    if (percent === 0) return styles.levelNone;
    if (percent < 40) return styles.levelLow;
    if (percent < 70) return styles.levelMedium;
    return styles.levelHigh;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Yearly Progress</h3>
        
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Less</span>
          <div className={styles.legendColors}>
            <div className={`${styles.legendSquare} ${styles.levelNone}`}></div>
            <div className={`${styles.legendSquare} ${styles.levelLow}`}></div>
            <div className={`${styles.legendSquare} ${styles.levelMedium}`}></div>
            <div className={`${styles.legendSquare} ${styles.levelHigh}`}></div>
          </div>
          <span className={styles.legendLabel}>More</span>
        </div>
      </div>

      <div className={styles.heatmapWrapper}>
        <div className={styles.heatmapGrid}>
          {stats365.map((day: DailyStat, i: number) => (
            <div
              key={i}
              className={`${styles.day} ${getColorClass(day.percent)}`}
              title={`${day.date} – ${day.percent}%`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}