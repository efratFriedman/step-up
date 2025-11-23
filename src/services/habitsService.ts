import { IHabit } from "@/interfaces/IHabit";
import { ITodayHabit } from "@/interfaces/ITodayHabit";

export interface IHabitClient {
  userId: string;
  name: string;
  description?: string;
  categoryId?: string;
  reminderTime?: { hour: number; minute: number };
  days?: boolean[];
}

export async function getUserHabits(): Promise<IHabit[]> {
  const res = await fetch(`/api/user-habits`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch user habits");
  }
  
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

export async function addHabit(habit: IHabitClient): Promise<IHabit> {
  const response = await fetch('/api/habits', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(habit),
  });

  if (!response.ok) {
    throw new Error("Failed to add habit");
  }

  return response.json();
}

export async function updateHabit(habitId: string, updatedData: Partial<IHabit>): Promise<IHabit> {
  const response = await fetch(`/api/habits/${habitId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updatedData),
  });

  if (!response.ok) {
    throw new Error("Failed to update habit");
  }

  return response.json();
}

export async function deleteHabit(habitId: string): Promise<void> {
  const response = await fetch(`/api/habits/${habitId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete habit");
  }
}

export async function updateHabitStatus(habitId: string, date?: Date) {
  const targetDate = date || new Date();

  const response = await fetch(`/api/habits/${habitId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ date: targetDate.toISOString() }),
  });

  if (!response.ok) {
    throw new Error("Failed to update habit status");
  }

  const data = await response.json();
  return data.habit;
}
