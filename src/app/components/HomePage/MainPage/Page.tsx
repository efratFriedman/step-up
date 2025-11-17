"use client";

import { useState, useEffect } from "react";
import DaysSlider from "../DaysSlider/DaysSlider";
import styles from './Page.module.css'; // ניצור קובץ CSS Module

export default function HomePage() {
  const [habits, setHabits] = useState([]);

  const fetchHabits = async (selectedDate: Date) => {
    const weekday = selectedDate.getDay();
    // const res = await fetch(`/api/habits?day=${weekday}`);
    // const data = await res.json();
    // setHabits(data);
  };

  useEffect(() => {
    fetchHabits(new Date()); 
  }, []);

  return (
    <div>
      {/* Wrapper עם רוחב מוגדר */}
      <div className={styles.sliderWrapper}>
        <DaysSlider onDaySelect={fetchHabits} />
      </div>

      <h2>Habits for selected day:</h2>
      {/* <div style={{ marginTop: "20px" }}>
        {habits.map((h: any) => (
          <div key={h._id}>{h.name}</div>
        ))}
      </div> */}
    </div>
  );
}
