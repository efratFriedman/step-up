import { useHabitLogStore } from "@/app/store/useHabitLogStore";
import { IHabitLog } from "@/interfaces/IHabitLog";
import { getHabitLogsForDate } from "@/services/client/habitLogService";
import { useEffect, useState } from "react";

export default function useHabitLogForDay(userId: string, date: Date) {
    const { logs, fetchLogs } = useHabitLogStore();
    const [dayLogs, setDayLogs] = useState<IHabitLog[]>([]);

    useEffect(() => {
        if(!userId||!date)return;

          async function load() {
      const iso = date.toISOString();

      // ✔ אם אין לוגים ליום הזה — נביא מהשרת דרך הסטור
      await fetchLogs(userId, iso);

      // ✔ נשארים עם אותה לוגיקה לחלוטין
      const filtered = logs.filter((log) => log.date === iso);

      setDayLogs(filtered);
    }

    load();
  }, [userId, date, logs]);
    return logs;
}