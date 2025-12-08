import { useHabitAppStore } from "@/app/store/habitAppStore/store";
import { IHabitLog } from "@/interfaces/IHabitLog";
import { useEffect, useMemo } from "react";

export default function useHabitLogForDay(userId: string, date: Date) {
  const logs = useHabitAppStore((s) => s.logs);
  const fetchLogs = useHabitAppStore((s) => s.fetchLogs);

  useEffect(() => {
    if (!userId || !date) return;

    const iso = date.toISOString(); 
    fetchLogs(userId, iso);

  }, [userId, date]); 

  const dayLogs = useMemo(() => {
    if (!date) return [];
    const iso = date.toISOString();

    return logs.filter((log) => {
      return log.date?.slice(0, 10) === iso.slice(0, 10);
    });
  }, [logs, date]);

  return dayLogs;
}
