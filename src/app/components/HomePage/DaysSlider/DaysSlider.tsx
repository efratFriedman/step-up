"use client";

import { useState, useEffect } from "react";
import styles from "./DaysSlider.module.css";
function cleanDate(date:Date){
  return new Date(date.getFullYear(),date.getMonth(),date.getDate());
}

function getNext7Days() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    days.push({
      date: d.getDate(),
      day: d.toLocaleString("en-US", { weekday: "short" }),
      full: cleanDate(d), 
      isToday: i === 0,
    });
  }

  return days;
}

export default function DaysSlider({ onDaySelect }: { onDaySelect: (day: Date) => void }) {
  const days = getNext7Days();
  const [selected, setSelected] = useState(days[0].full);

  useEffect(() => {
    onDaySelect(days[0].full);
  }, []);

  const handleSelect = (day: any) => {
    setSelected(day.full);
    onDaySelect(day.full);
  };

  return (
    <div className={styles.sliderWrapper}>
    <div className={styles.sliderContainer}>
    {days.map(day => (
    <div
        key={day.full.toISOString()}
        className={`${styles.dayItem} ${selected.getDate() === day.full.getDate() ? styles.selected : ""} ${
        day.isToday ? styles.today : ""
        }`}
        onClick={() => handleSelect(day)}
    >
        <div className={styles.date}>{day.date}</div>
        <div className={styles.day}>{day.day}</div>
    </div>
    ))}
    </div>
    </div>
  );
}
