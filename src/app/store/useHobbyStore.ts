import { create } from "zustand";
import { IHabit } from "@/interfaces/IHabit";

interface HabitStore {
    habits: IHabit[];
    loading: boolean;
    error: string | null;
  
    fetchHabits: (userId: string) => Promise<void>;
    addHabit: (habit: IHabitClient) => Promise<void>;
    updateHabit: (habitId: string, updatedData: Partial<IHabit>) => Promise<void>;
    deleteHabit: (habitId: string) => Promise<void>;
  }

  export interface IHabitClient {
    userId: string;
    name: string;
    description?: string;
    categoryId?: string;
    reminderTime?: { hour: number; minute: number };
    days?: boolean[];
  }
  

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  loading: false,
  error: null,

  fetchHabits: async (userId: string) => {
    set({ loading: true, error: null });
    try {

        const localData = localStorage.getItem(`habits_${userId}`);
        if (localData) {
          set({ habits: JSON.parse(localData), loading: false });
          return;
        }

      const res = await fetch(`/api/habits?userId=${userId}`);
      if (!res.ok) throw new Error("error loading the habits");
      const data = await res.json();

      localStorage.setItem(`habits_${userId}`, JSON.stringify(data));

      set({ habits: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addHabit: async (habit: IHabitClient) => {  
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(habit),
      });
        if (!res.ok) throw new Error("error add the habit");

        const newHabit: IHabit = await res.json();  

        set((state) => {
            const updatedHabits = [...state.habits, newHabit];
            if (habit.userId) {
                localStorage.setItem(`habits_${habit.userId}`, JSON.stringify(updatedHabits));
            }
            return { habits: updatedHabits, loading: false };
        });
    } catch (err: any) {
        set({ error: err.message, loading: false });
    }
},


  updateHabit: async (habitId: string, updatedData: Partial<IHabit>) => {
    set({ loading: true, error: null });
    try{
        const res = await fetch(`/api/habits/${habitId}`,{
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });
        if (!res.ok) throw new Error("error update the habit");
        const updatedHabit = await res.json();
        set((state) => {
            const updatedHabits = state.habits.map((h) =>
              h._id?.toString() === habitId ? updatedHabit : h
            );
            if (updatedHabit.userId) {
              localStorage.setItem(`habits_${updatedHabit.userId}`, JSON.stringify(updatedHabits));
            }
  
            return { habits: updatedHabits, loading: false };
          });
    } catch (err: any) {
        set({ error: err.message, loading: false });
      }
    },

    deleteHabit: async (habitId: string) => {
        set({ loading: true, error: null });
        try{
            const res = await fetch(`/api/habits/${habitId}`,{
                method: "DELETE",
            });
            if (!res.ok) throw new Error("error delete the habit");
            set((state) => {
                const deletedHabit = state.habits.find(h => h._id === habitId);
                const updatedHabits = state.habits.filter((h) => h._id?.toString() !== habitId);

                if (deletedHabit?.userId) {
                    localStorage.setItem(`habits_${deletedHabit.userId}`, JSON.stringify(updatedHabits));
                }
    
                return { habits: updatedHabits, loading: false };
            });
        } catch (err: any) {
            set({ error: err.message, loading: false });
          }
        }

}));