import { StateCreator } from "zustand";
import { HabitAppSlice, TodaySlice } from "./types";

import { getHabitsByDate } from "@/services/client/habitsService";
import { updateHabitStatus } from "@/services/client/habitLogService";

export const createTodaySlice: StateCreator<
  HabitAppSlice,
  [],
  [],
  TodaySlice
> = (set, get) => ({
  todayHabits: [],
  loadingToday: false,

  fetchTodayHabits: async (date) => {
    set({ loadingToday: true });

    const data = await getHabitsByDate(date);
    set({
      todayHabits: data || [],
      loadingToday: false,
    });
  },

  toggleTodayStatus: async (logId) => {
    const updated = await updateHabitStatus(logId);

    set({
      todayHabits: get().todayHabits.map((h) =>
        h.logId === logId ? { ...h, isDone: updated.isDone } : h
      ),
    });
  },
});
