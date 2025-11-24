import { create } from "zustand";
import { persist } from "zustand/middleware";
import { IHabit } from "@/interfaces/IHabit";
import { addHabit, deleteHabit, getUserHabits, updateHabit } from "@/services/client/habitsService";

interface HabitStore {
  habits: IHabit[];
  loading: boolean;
  error: string | null;

  fetchHabits: () => Promise<void>;
  addHabit: (data: any) => Promise<void>;
  updateHabit: (habitId: string, updatedData: Partial<IHabit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
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
        set({ loading: true });
        try {
          const created = await addHabit(habitData);
          set({
            habits: [...get().habits, created],
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
      updateHabit: async (habitId: string, updatedData: Partial<IHabit>) => {
        set({ loading: true, error: null });

        try {
          const updatedHabit = await updateHabit(habitId, updatedData);
          set((state) => ({
            habits: state.habits.map((h) =>
              h._id?.toString() === habitId ? updatedHabit : h
            ),
            loading: false,
          }));
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },

      deleteHabit: async (id) => {
        set({ loading: true });
        try {
          await deleteHabit(id);
          set({
            habits: get().habits.filter((h) => h._id !== id),
            loading: false,
          });
        } catch (err: any) {
          set({ error: err.message, loading: false });
        }
      },
    }),
    {
      name: "habits-storage",
    }
  )
);