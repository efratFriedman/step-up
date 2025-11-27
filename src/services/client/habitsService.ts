import { IHabit } from "@/interfaces/IHabit";
import { ITodayHabit } from "@/interfaces/ITodayHabit";

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
export async function getTodayHabits(date?: Date, retries = 3) {
  const targetDate = date || new Date();
  const dateString = targetDate.toISOString().split("T")[0];

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(
        `/api/habits/today?date=${dateString}`,
        {
          method: "GET",
          credentials: "include",
          signal: AbortSignal.timeout(10000),
        }
      );

      if (!response.ok) {
        if (i < retries - 1 && response.status === 500) {
          
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        throw new Error("Failed to fetch habits for today");
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

export async function deleteHabit(habitId: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/habits/${habitId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete habit");
  }

  return response.json();
}
export async function addHabit(habit: any) {
  const res = await fetch("/api/habits", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(habit),
  });

  if (!res.ok) {
    throw new Error("Failed to create habit");
  }

  return res.json();
}
export async function updateHabit(habitId: string, updatedData: any) {
  const res = await fetch(`/api/habits/${habitId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) {
    throw new Error("Failed to update habit");
  }

  return res.json(); 
}

// export async function getHabitsByDate(date: Date) {
//   const dateString = date.toISOString().split("T")[0];

//   const res = await fetch(`/api/habits/by-date?date=${dateString}`, {
//     method: "GET",
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error("Failed to load habits");

//   return res.json(); 
// }
export async function  getHabitsByDate(date: string) {

  const res = await fetch(`/api/habits/by-date?date=${date}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to load habits");

  return res.json(); 
}


