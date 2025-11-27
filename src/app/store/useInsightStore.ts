import { create } from "zustand";
import { getInsights } from "@/services/client/insightService";

interface InsightsState {
    dayStreak: number;
    achievements: number;
    completed: number;
    completedToday: number;
    loading: boolean;
  
    fetchInsights: () => Promise<void>;
  }

export const useInsightStore = create<InsightsState>((set) => ({
    dayStreak: 0,
    achievements: 0,
    completed: 0,
    completedToday: 0,
    loading: false,
  
    fetchInsights: async () => {
      try {
        set({ loading: true });
        const data = await getInsights();
        set({
          dayStreak: data.dayStreak,
          achievements: data.achievements,
          completed: data.completed,
          completedToday: data.completedToday,
          loading: false,
        });
      } catch (err) {
        console.error("Error fetching insights:", err);
        set({ loading: false });
      }
    },
  }));