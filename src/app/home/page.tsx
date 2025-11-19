"use client";

import { useState, useEffect } from "react";
import styles from './HomePage.module.css';
import ProgressBar from "../components/HomePage/ProgressBar/ProgressBar";
import DaysSlider from "../components/HomePage/DaysSlider/DaysSlider";
import TodayHabits from "../components/HomePage/TodayHabits/TodayHabits";

export default function HomePage() {
  const [habits, setHabits] = useState([]);

  const fetchHabits = async (selectedDate: Date) => {
    const weekday = selectedDate.getDay();
  };

  useEffect(() => {
    fetchHabits(new Date());
  }, []);

  return (
    <div>
        <ProgressBar/>
      <div className={styles.sliderWrapper}>
        <DaysSlider onDaySelect={fetchHabits} />
      </div>

      <h2>Habits for selected day:</h2>
      {/* <div style={{ marginTop: "20px" }}>
        {habits.map((h: any) => (
          <div key={h._id}>{h.name}</div>
        ))}
      </div> */}
      <TodayHabits />
    </div>
  );
}
