import { create } from "zustand";
import { HabitAppSlice } from "./types";
import { createHabitsSlice } from "./habitSlice";
import { createTodaySlice } from "./todaySlice";
import { createLogsSlice } from "./logSlice";



export const useHabitAppStore = create<HabitAppSlice>()((...args) => ({
  ...createHabitsSlice(...args),
  ...createTodaySlice(...args),
  ...createLogsSlice(...args),
}));
