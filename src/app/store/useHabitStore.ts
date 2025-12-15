import { create } from "zustand";
import { IHabit } from "@/interfaces/IHabit";
import {
  addHabit,
  deleteHabit,
  getUserHabits,
  updateHabit,
} from "@/services/client/habitsService";
import { useHabitLogStore } from "./useHabitLogStore";
import { useStatisticsStore } from "./useStatisticsStore";

interface HabitStore {
  habits: IHabit[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;

  fetchHabits: () => Promise<void>;
  addHabit: (data: any) => Promise<void>;
  updateHabit: (habitId: string, updatedData: Partial<IHabit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  loading: false,
  error: null,
  lastFetched: null,

  fetchHabits: async () => {
    const { lastFetched, habits } = get();

    if (lastFetched && habits.length > 0) return;

    set({ loading: true, error: null });

    try {
      const data = await getUserHabits();
      if (!data || data.length === 0) {
        set({
          habits: [],
          loading: false,
          error: "NO_HABITS",
          lastFetched: Date.now(),
        });
        return;
      }

      set({
        habits: data,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (err: any) {
      set({
        error: err.message || "FAILED_FETCH_HABITS",
        loading: false,
      });
    }
  },

  addHabit: async (habitData) => {
    try {
      const created = await addHabit(habitData);

      set({
        habits: [...get().habits, created],
        error: null,
      });

      useHabitLogStore.getState().clearLogs();

      useStatisticsStore.getState().invalidateAll();

    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateHabit: async (habitId, updatedData) => {
    try {
      const updatedHabit = await updateHabit(habitId, updatedData);

      set((state) => ({
        habits: state.habits.map((h) =>
          h._id === habitId ? updatedHabit : h
        ),
        error: null,
      }));

      useHabitLogStore.getState().clearLogs();

      useStatisticsStore.getState().invalidateAll();

    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteHabit: async (id) => {
    try {
      await deleteHabit(id);

      set({
        habits: get().habits.filter((h) => h._id !== id),
        error: null,
        lastFetched: null
      });

      useHabitLogStore.getState().clearLogs();

      useStatisticsStore.getState().invalidateAll();

    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
