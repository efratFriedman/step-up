import { IHabit } from "@/interfaces/IHabit";

export async function getUserHabits(userId:string):Promise<IHabit[]>{
    const res=await fetch(`/api/habits?userId=${userId}`,
        {method:"GET",

        });
        return res.json();
}