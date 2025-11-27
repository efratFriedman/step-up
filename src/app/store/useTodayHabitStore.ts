// // useTodayHabitsStore.ts
// import { create } from "zustand";
// import { getHabitsByDate } from "@/services/client/habitsService";
// import { updateHabitStatus } from "@/services/client/habitLogService";
// import { ITodayHabit } from "@/interfaces/ITodayHabit";

// interface TodayHabitsStore {
//   habits: ITodayHabit[];
//   loading: boolean;
//   error: string | null;

//   fetchTodayHabits: (date: Date) => Promise<void>;
//   toggleStatus: (logId: string) => Promise<void>;
// }

// export const useTodayHabitStore = create<TodayHabitsStore>((set, get) => ({
//   habits: [],
//   loading: false,
//   error: null,

//   fetchTodayHabits: async (date: Date) => {
//     set({ loading: true, error: null });

//     try {
//       const data = await getHabitsByDate(date);
//       set({ habits: data, loading: false });
//     } catch (err: any) {
//       set({ loading: false, error: err.message });
//     }
//   },

//   toggleStatus: async (logId: string) => {
//     try {
//       const updated = await updateHabitStatus(logId);

//       set({
//         habits: get().habits.map((h) =>
//           h.logId === logId ? { ...h, isDone: updated.isDone } : h
//         )
//       });
//     } catch (err) {
//       console.error("failed toggling", err);
//     }
//   },
// }));
import { create } from "zustand";
import { getHabitsByDate } from "@/services/client/habitsService";
import { updateHabitStatus } from "@/services/client/habitLogService";
import { ITodayHabit } from "@/interfaces/ITodayHabit";

interface TodayHabitsStore {
  habits: ITodayHabit[];
  loading: boolean;
  error: string | null;

  fetchTodayHabits: (date: string) => Promise<void>;
  toggleStatus: (logId: string) => Promise<void>;
}

export const useTodayHabitStore = create<TodayHabitsStore>((set, get) => ({
  habits: [],
  loading: false,
  error: null,

  fetchTodayHabits: async (date: string) => {
    set({ loading: true, error: null });

    try {
      const data = await getHabitsByDate(date);
      set({ habits: data, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message });
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
  },
}));