"use client";

import { useState } from "react";
import ProgressBar from "../components/HomePage/ProgressBar/ProgressBar";
import DaysSlider from "../components/HomePage/DaysSlider/DaysSlider";
import TodayHabits from "../components/HomePage/TodayHabits/TodayHabits";
import NewHabit from "../components/Habit/AddHabit/NewHabit/NewHabit";

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  return (
    <div>
      <ProgressBar />
      <DaysSlider onDaySelect={setSelectedDate} />
      <h2>Habits for selected day:</h2>
      <TodayHabits selectedDate={selectedDate} />
      <NewHabit />
    </div>
  );
}
