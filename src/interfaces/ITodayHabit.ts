export interface ITodayHabit {
  habitId: string;
  logId: string;

  name: string;
  description?: string;
  reminderTime?: { hour: number; minute: number };

  isDone: boolean;
  date: string;

  size?: "small" | "medium" | "large";

  category: {
    name: string;
    colorTheme?: string;
    image?: string;
  };
}
