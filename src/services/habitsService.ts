import { IHabit } from "@/interfaces/IHabit";
import { ITodayHabit } from "@/interfaces/ITodayHabit";

export async function getUserHabits(): Promise<IHabit[]> {
    const res = await fetch(`/api/user-habits`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}

export async function getTodayHabits(): Promise<ITodayHabit[]> {
    const res = await fetch('/api/habits/today', {
        method: "GET",
        credentials: "include", 
    });
    
    if (!res.ok) {
        const error = await res.json();
        console.error("Error fetching today habits:", error);
        throw new Error(error.message || "Failed to fetch habits");
    }
    
    const data = await res.json();
    return data.habits || [];
}

export async function updateHabitStatus(habitId: string) {
    const res = await fetch(`/api/habits/toggle/${habitId}`, {
        method: "POST",
        credentials: "include",
    });
    
    if (!res.ok) {
        throw new Error("Failed to update habit status");
    }
    
    return res.json();
}