import { DailyStat } from "@/utils/statistics";

export function getBeginDate(stats365: DailyStat[]) {
  if (!stats365.length) return null;
  return new Date(stats365[0].date);
}

export function getEndDate(stats365: DailyStat[]) {
  if (!stats365.length) return null;
  return new Date(stats365[stats365.length - 1].date);
}

export function getNextMonth(currentMonth: number, currentYear: number) {
  const newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  return { newMonth, newYear };
}

export function getPrevMonth(currentMonth: number, currentYear: number) {
  const newMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const newYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  return { newMonth, newYear };
}

export function applyCircularMonthBoundary(
  target: Date,
  beginDate: Date,
  endDate: Date
) {
  if (target > endDate) return { month: endDate.getMonth(), year: endDate.getFullYear() };
  if (target < beginDate) return { month: beginDate.getMonth(), year: beginDate.getFullYear() };
  return null; 
}

export function filterMonthStats(
  stats365: DailyStat[],
  month: number,
  year: number
) {
  return stats365.filter((day) => {
    const d = new Date(day.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

export function buildCalendarCells(monthStats: DailyStat[], month: number, year: number) {
  const cells = Array(42).fill(null);
  const firstDay = new Date(year, month, 1);
  const startIndex = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const match = monthStats.find((x) => new Date(x.date).getDate() === i);
    cells[startIndex + (i - 1)] = match ?? null;
  }

  return cells;
}

export function getColorLevel(percent: number | null, styles: any) {
  if (percent === null || percent === 0) return styles.levelNone;
  if (percent < 40) return styles.levelLow;
  if (percent < 70) return styles.levelMedium;
  return styles.levelHigh;
}
