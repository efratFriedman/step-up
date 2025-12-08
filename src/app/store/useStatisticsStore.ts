import { create } from "zustand";
import { getStatistics } from "@/services/client/statisticsService";
import { DailyStat } from "@/utils/statistics";

interface StatisticsStore {
  stats7: DailyStat[];
  stats30: DailyStat[];
  stats365: DailyStat[];

  category7: any[];
  category30: any[];
  category365: any[];

  loading7: boolean;
  loading30: boolean;
  loading365: boolean;

  fetchStatisticsFor: (range: 7 | 30 | 365) => Promise<void>;
}

export const useStatisticsStore = create<StatisticsStore>((set, get) => ({
  stats7: [],
  stats30: [],
  stats365: [],

  category7: [],
  category30: [],
  category365: [],

  loading7: false,
  loading30: false,
  loading365: false,

  async fetchStatisticsFor(range) {
    const statsKey = `stats${range}` as const;
    const categoryKey = `category${range}` as const;
    const loadingKey = `loading${range}` as const;

    if (get()[statsKey].length > 0 && get()[categoryKey].length > 0) {
      return;
    }

    set({ [loadingKey]: true });

    try {
      const res = await getStatistics(range);

      set({
        [statsKey]: res.stats,
        [categoryKey]: res.categories,
        [loadingKey]: false,
      });
    } catch (err) {
      console.error("Statistics store error:", err);
      set({ [loadingKey]: false });
    }
  },
}));
