import { IHabitLog } from "@/interfaces/IHabitLog";

export async function getHabitLogsForDate(userId:string,date:string):Promise<IHabitLog[]>{
    const res=await fetch(`/api/habit-log?userId=${userId}&date=${date}`);
    return res.json();
}