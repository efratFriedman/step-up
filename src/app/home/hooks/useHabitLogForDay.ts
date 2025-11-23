import { useHabitLogStore } from "@/app/store/useHabitLogStore";
import { useEffect, useMemo } from "react";

export default function useHabitLogForDay(userId: string, date: Date) {
  const { logs, fetchLogs } = useHabitLogStore();

  useEffect(() => {
    if (!userId || !date) return;
    fetchLogs(userId, date.toISOString());
  }, [userId, date]);

  const logsForDay = useMemo(() => {
    if (!Array.isArray(logs)) return [];
    return logs;
  }, [logs]);

  return logsForDay;
}
