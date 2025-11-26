
import { ITodayHabit } from "@/interfaces/ITodayHabit";
import { toUTCDate } from "./date";

export const hexToRgba = (hex: string, alpha: number): string => {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getCategoryStyle = (habit: ITodayHabit) => {
  const originalColor = habit.category?.colorTheme || "#f3f4f6";
  const pastelColor = hexToRgba(originalColor, 0.45);

  return {
    backgroundColor: pastelColor,
  };
};

 export function getNext7Days() {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    days.push({
      date: d.getDate(),
      day: d.toLocaleString("en-US", { weekday: "short" }),
      full: toUTCDate(d), 
      isToday: i === 0,
    });
  }

  return days;
}

