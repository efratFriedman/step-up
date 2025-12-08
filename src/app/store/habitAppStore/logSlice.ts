import { StateCreator } from "zustand";
import { HabitAppSlice, LogsSlice } from "./types";

import { getHabitLogsForDate } from "@/services/client/habitLogService";

export const createLogsSlice: StateCreator<
  HabitAppSlice,
  [],
  [],
  LogsSlice
> = (set) => ({
  logs: [],
  loadingLogs: false,

  fetchLogs: async (userId, date) => {
    set({ loadingLogs: true });

    const data = await getHabitLogsForDate(userId, date);
    set({
      logs: data || [],
      loadingLogs: false,
    });
  },
});
