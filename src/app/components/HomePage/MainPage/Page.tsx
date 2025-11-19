"use client";

import { useState } from "react";
import DaysSlider from "../DaysSlider/DaysSlider";
import TodayHabits from "../TodayHabits/TodayHabits";
import styles from './Page.module.css';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleDaySelect = (day: Date) => {
    setSelectedDate(day);
  };

  return (
    <div>
      <div className={styles.sliderWrapper}>
        <DaysSlider onDaySelect={handleDaySelect} />
      </div>

      <h2>Habits for selected day:</h2>
      
      <TodayHabits selectedDate={selectedDate} />
    </div>
  );
}
