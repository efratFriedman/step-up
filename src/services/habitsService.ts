import { IHabit } from "@/interfaces/IHabit";
import { ITodayHabit } from "@/interfaces/ITodayHabit";

export async function getUserHabits(): Promise<IHabit[]> {
    const res = await fetch(`/api/user-habits`, {
        method: "GET",
        credentials: "include",
    });
    return res.json();
}
export async function getTodayHabits(date?: Date) {
    const targetDate = date || new Date();
    const dateString = targetDate.toISOString().split('T')[0];
    
    const response = await fetch(`/api/habits/today?date=${dateString}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    
      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }
    
      const data = await response.json();
      return data.habits || [];
}

export async function updateHabitStatus(habitId: string, date?: Date) {
    const targetDate = date || new Date();
    
    const response = await fetch(`/api/habits/${habitId}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: targetDate.toISOString() }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to update habit status");
    }
  
    const data = await response.json();
    return data.habit;
  }