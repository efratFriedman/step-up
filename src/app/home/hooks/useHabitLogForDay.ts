import { IHabitLog } from "@/interfaces/IHabitLog";
import { getHabitLogsForDate } from "@/services/habitLogService";
import { useEffect, useState } from "react";

export default function useHabitLogForDay(userId:string,date:Date){
    const [logs,setLogs]=useState<IHabitLog[]>([]);

    useEffect(()=>{
        async function load() {
            const iso=date.toISOString();
            const result=await getHabitLogsForDate(userId,iso);
            setLogs(result);
        }
        load();
    },[userId,date]);
    return logs;
}