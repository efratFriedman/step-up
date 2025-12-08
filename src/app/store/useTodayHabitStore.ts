import { create } from "zustand";
import { getHabitsByDate } from "@/services/client/habitsService";
import { updateHabitStatus } from "@/services/client/habitLogService";
import { ITodayHabit } from "@/interfaces/ITodayHabit";

interface TodayHabitsStore {
  habits: ITodayHabit[];
  loading: boolean;
  error: string | null;
  lastFetchedDate: string | null;

  fetchTodayHabits: (date: string) => Promise<void>;
  toggleStatus: (logId: string) => Promise<void>;
}

export const useTodayHabitStore = create<TodayHabitsStore>((set, get) => ({
  habits: [],
  loading: false,
  error: null,
  lastFetchedDate: null,

  fetchTodayHabits: async (date: string) => {
    const { lastFetchedDate, habits } = get();

    if (lastFetchedDate === date && habits.length > 0) return;

    set({ loading: true, error: null });

    try {
      const data = await getHabitsByDate(date);

      if (!data || data.length === 0) {
        set({
          habits: [],
          loading: false,
          error: "NO_HABITS",
          lastFetchedDate: date,
        });
        return;
      }

      set({
        habits: data,
        loading: false,
        error: null,
        lastFetchedDate: date,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || "FAILED_FETCH_TODAY",
      });
    }
  },

  toggleStatus: async (logId: string) => {
    try {
      const updated = await updateHabitStatus(logId);

      set({
        habits: get().habits.map((h) =>
          h.logId === logId ? { ...h, isDone: updated.isDone } : h
        )
      });
    } catch (err) {
      console.error("failed toggling", err);
    }
  }
}));
