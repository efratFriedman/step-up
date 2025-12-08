import { StateCreator } from "zustand";
import { HabitAppSlice, HabitsSlice } from "./types";

import {
  getUserHabits,
  addHabit ,
  updateHabit ,
  deleteHabit ,
} from "@/services/client/habitsService";

export const createHabitsSlice: StateCreator<
  HabitAppSlice,
  [],
  [],
  HabitsSlice
> = (set, get) => ({
  habits: [],
  loadingHabits: false,

  fetchHabits: async () => {
    set({ loadingHabits: true });

    const data = await getUserHabits();
    set({
      habits: data || [],
      loadingHabits: false,
    });
  },

  addHabit: async (habitData) => {
    const created = await addHabit(habitData);

    set({
      habits: [...get().habits, created],
    });

    const today = new Date().toISOString().split("T")[0];
    await get().fetchTodayHabits(today);
  },

  updateHabit: async (id, updatedData) => {
    const updated = await updateHabit(id, updatedData);

    set({
      habits: get().habits.map((h) =>
        h._id === id ? updated : h
      ),
    });

    const today = new Date().toISOString().split("T")[0];
    await get().fetchTodayHabits(today);
  },

  deleteHabit: async (id) => {
    await deleteHabit(id);

    set({
      habits: get().habits.filter((h) => h._id !== id),
    });

    const today = new Date().toISOString().split("T")[0];
    await get().fetchTodayHabits(today);
  },
});
