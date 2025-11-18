import { IHabit } from "@/interfaces/IHabit";

export async function getUserHabits(userId: string): Promise<IHabit[]> {
    const res = await fetch(`/api/habits?userId=${userId}`,
        {
            method: "GET",
        });
    return res.json();
}

export async function getTodayHabits():Promise<IHabit[]> {
    const res = await fetch('/api/habits/today',
        {
            method:"GET",
        }
    );
    return res.json();

}

export async function updateHabitStatus(habitId:string){
    const res=await fetch(`/api/habits/toggle/${habitId}`,
        {method:"POST"},

    )
    return res.json();
}