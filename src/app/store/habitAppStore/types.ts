import { IHabit } from "@/interfaces/IHabit";
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import { IHabitLog } from "@/interfaces/IHabitLog";

export interface HabitsSlice {
  habits: IHabit[];
  loadingHabits: boolean;
  fetchHabits: () => Promise<void>;
  addHabit: (data: Partial<IHabit>) => Promise<void>;
  updateHabit: (id: string, data: Partial<IHabit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
}

export interface TodaySlice {
  todayHabits: ITodayHabit[];
  loadingToday: boolean;
  fetchTodayHabits: (date: string) => Promise<void>;
  toggleTodayStatus: (logId: string) => Promise<void>;
}

export interface LogsSlice {
  logs: IHabitLog[];
  loadingLogs: boolean;
  fetchLogs: (userId: string, date: string) => Promise<void>;
}

export type HabitAppSlice = HabitsSlice & TodaySlice & LogsSlice;
