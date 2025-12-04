import { useHabitLogStore } from "@/app/store/useHabitLogStore";
import { useEffect, useMemo } from "react";

export default function useHabitLogForDay(userId: string, date: Date) {
    const { logs, fetchLogs } = useHabitLogStore();

    useEffect(() => {
        if (!userId || !date) return;
        
        const iso = date.toISOString();
        fetchLogs(userId, iso);
    }, [userId, date, fetchLogs]);

    // Filter logs for the specific date
    const dayLogs = useMemo(() => {
        if (!date) return [];
        const iso = date.toISOString();
        return logs.filter((log) => log.date === iso);
    }, [logs, date]);

    return dayLogs;
}