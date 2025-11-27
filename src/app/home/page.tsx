"use client";

import { useState } from "react";
import ProgressBar from "../components/HomePage/ProgressBar/ProgressBar";
import DaysSlider from "../components/HomePage/DaysSlider/DaysSlider";
import TodayHabits from "../components/HomePage/TodayHabits/TodayHabits";
import NewHabit from "../components/Habit/AddHabit/NewHabit/NewHabit";
import styles from "./HomePage.module.css";


export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  
  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className={styles.container}>
      <ProgressBar />
      <DaysSlider onDaySelect={setSelectedDate} />
      <h2 className={styles.habitsHeader}>
        {dayName} habits!
      </h2>
      <TodayHabits selectedDate={selectedDate} />
      <NewHabit />
    </div>
  );
}