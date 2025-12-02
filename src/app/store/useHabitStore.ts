import { create } from "zustand";
import { IHabit } from "@/interfaces/IHabit";
import {
  addHabit,
  deleteHabit,
  getUserHabits,
  updateHabit,
} from "@/services/client/habitsService";

interface HabitStore {
  habits: IHabit[];
  loading: boolean;
  error: string | null;

  fetchHabits: () => Promise<void>;
  addHabit: (data: any) => Promise<void>;
  updateHabit: (habitId: string, updatedData: Partial<IHabit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  loading: false,
  error: null,

  fetchHabits: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getUserHabits();
      set({ habits: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addHabit: async (habitData) => {
    try {
      const created = await addHabit(habitData);
      set({ habits: [...get().habits, created] });
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
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  deleteHabit: async (id) => {
    try {
      await deleteHabit(id);
      set({
        habits: get().habits.filter((h) => h._id !== id),
      });
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
