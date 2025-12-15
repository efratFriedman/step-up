import { create } from "zustand";
import { getStatistics } from "@/services/client/statisticsService";
import { DailyStat } from "@/utils/statistics";

interface StatisticsStore {// 
  stats7: DailyStat[];
  stats30: DailyStat[];
  stats365: DailyStat[];

  category7: any[];
  category30: any[];
  category365: any[];

  loading7: boolean;
  loading30: boolean;
  loading365: boolean;

  fetched7: boolean;
  fetched30: boolean;
  fetched365: boolean;

  fetchStatisticsFor: (range: 7 | 30 | 365) => Promise<void>;
  invalidateAll: () => void;
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

  fetched7: false,
  fetched30: false,
  fetched365: false,

  invalidateAll() {
    set({
      stats7: [],
      stats30: [],
      stats365: [],
      category7: [],
      category30: [],
      category365: [],
      fetched7: false,
      fetched30: false,
      fetched365: false,
    });
  },

  async fetchStatisticsFor(range) {
    const statsKey = `stats${range}` as const;
    const categoryKey = `category${range}` as const;
    const loadingKey = `loading${range}` as const;
    const fetchedKey = `fetched${range}` as const;

    if (get()[fetchedKey]) return;

    set({ [loadingKey]: true });

    try {
      const res = await getStatistics(range);

      set({
        [statsKey]: res.stats,              
        [categoryKey]: res.categories,       
        [loadingKey]: false,
        [fetchedKey]: true,                 
      });
    } catch (err) {
      console.error("Statistics store error:", err);
      set({ [loadingKey]: false, [fetchedKey]: true });
    }
  },
}));
