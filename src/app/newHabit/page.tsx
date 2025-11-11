"use client";

import { ICategory } from "@/interfaces/ICategory";
import { useEffect, useState } from "react";
import HabitForm from "../components/HabitForm/HabitForm";

export default function AddHabitPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //fetch 
        //       fetch("/api/categories")
        //   .then(res => res.json())
        //   .then(data => setCategories(data))
        //   .finally(() => setIsLoading(false));
    }, []);

    const handleAddHabit = (data: any) => {
        console.log("Submitting habit:", data);
        // כאן תשלחי ל־API להוספת הרגל למסד
        //הוספה לזוסטנד ?
    }

    const handleCancel = () => {
        console.log("Cancelled");

    }

    if (isLoading) return <p>Loading categories...</p>;

    return (
        <HabitForm
            categories={categories}
            onSubmit={handleAddHabit}
            onCancel={handleCancel}
        />
    );
}