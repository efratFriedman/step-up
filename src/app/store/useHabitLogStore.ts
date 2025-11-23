import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IHabitLog } from "@/interfaces/IHabitLog";
import { getHabitLogsForDate, createHabitLog } from "@/services/habitLogService";

interface HabitLogStore {
  logs: IHabitLog[];
  loading: boolean;
  error: string | null;

  fetchLogs: (userId: string, date: string) => Promise<void>;
  addLog: (habitId: string, date: Date) => Promise<void>;
}

export const useHabitLogStore = create<HabitLogStore>()(
  persist(
    (set, get) => ({
      logs: [],
      loading: false,
      error: null,

      fetchLogs: async (userId, date) => {
        set({ loading: true, error: null });
        try {
          const data = await getHabitLogsForDate(userId, date);
          set({ logs: data, loading: false });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      
      addLog: async (habitId, date) => {
        set({ loading: true, error: null });
        try {
          const created = await createHabitLog(habitId, date);

          set({
            logs: [...get().logs, created],
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: "habit-log-storage",
    }
  )
);