import { IHabitLog } from "@/interfaces/IHabitLog";

export async function getHabitLogsForDate(userId: string, date: string): Promise<IHabitLog[]> {
    const res = await fetch(`/api/habit-log?userId=${userId}&date=${date}`, {
        method: "GET",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch habit logs");
    }

    return res.json();
}

export async function createHabitLog(habitId: string, date: Date): Promise<IHabitLog> {
    const response = await fetch('/api/habit-log', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            habitId,
            date: date.toISOString(),
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create habit log");
    }

    return response.json()
}

export async function updateHabitStatus(logId: string) {
    const res = await fetch(`/api/habit-log/${logId}`, {
        method: "PATCH",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error("Failed to update habit status");
    }

    return res.json();
}