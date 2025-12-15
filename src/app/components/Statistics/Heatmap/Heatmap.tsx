"use client";

import { useEffect, useState, useMemo } from "react";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import styles from "@/app/components/Statistics/Heatmap/Heatmap.module.css";

import {
  getBeginDate,
  getEndDate,
  getNextMonth,
  getPrevMonth,
  applyCircularMonthBoundary,
  filterMonthStats,
  buildCalendarCells,
  getColorLevel
} from "@/utils/HeatMapFunctions";
import Loader from "../../Loader/Loader";

export default function HeatmapMonth() {
  const RANGE = 365;
  const { stats365, loading365, fetchStatisticsFor } = useStatisticsStore();

  // טעינה ראשונית
  useEffect(() => {
    fetchStatisticsFor(RANGE);
  }, []);

  // ⭐ NEW — אם invalidateAll אפס את stats365 → לטעון מחדש
  useEffect(() => {
    if (stats365.length === 0) {
      fetchStatisticsFor(RANGE);
    }
  }, [stats365]);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const beginDate = useMemo(() => getBeginDate(stats365), [stats365]);
  const endDate = useMemo(() => getEndDate(stats365), [stats365]);

  const handleNext = () => {
    const { newMonth, newYear } = getNextMonth(currentMonth, currentYear);
    const target = new Date(newYear, newMonth, 1);

    const clamp = applyCircularMonthBoundary(target, beginDate!, endDate!);
    if (clamp) {
      setCurrentMonth(clamp.month);
      setCurrentYear(clamp.year);
    } else {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const handlePrev = () => {
    const { newMonth, newYear } = getPrevMonth(currentMonth, currentYear);
    const target = new Date(newYear, newMonth, 1);

    const clamp = applyCircularMonthBoundary(target, beginDate!, endDate!);
    if (clamp) {
      setCurrentMonth(clamp.month);
      setCurrentYear(clamp.year);
    } else {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const monthStats = useMemo(
    () => filterMonthStats(stats365, currentMonth, currentYear),
    [stats365, currentMonth, currentYear]
  );

  const cells = useMemo(
    () => buildCalendarCells(monthStats, currentMonth, currentYear),
    [monthStats, currentMonth, currentYear]
  );

  const monthName = new Date(currentYear, currentMonth).toLocaleString("en", {
    month: "long",
  });

  if (loading365 || !beginDate || !endDate) return <Loader/>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={handlePrev}>⟵</button>
        <h3 className={styles.title}>{monthName} {currentYear}</h3>
        <button className={styles.navBtn} onClick={handleNext}>⟶</button>
      </div>

      <div className={styles.grid}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={`${d}-${i}`} className={styles.weekday}>{d}</div>
        ))}

        {cells.map((cell, i) => (
          <div
            key={i}
            className={`${styles.day} ${getColorLevel(cell?.percent ?? null, styles)}`}
          ></div>
        ))}
      </div>

      <div className={styles.legend}>
        <span>Less</span>
        <div className={styles.legendColors}>
          <div className={`${styles.legendSquare} ${styles.levelNone}`}></div>
          <div className={`${styles.legendSquare} ${styles.levelLow}`}></div>
          <div className={`${styles.legendSquare} ${styles.levelMedium}`}></div>
          <div className={`${styles.legendSquare} ${styles.levelHigh}`}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
