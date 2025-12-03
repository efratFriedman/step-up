"use client";

import { useEffect } from "react";
import { toUrlName } from "@/app/components/Settings/CategoryItem/CategoryItem";
import HabitItem from "@/app/components/Settings/HabitItem/HabitItem";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitStore } from "@/app/store/useHabitStore";
import { useParams } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";

export default function CategoryPage() {
    const { name } = useParams();

    const { categories, fetchCategories, loading: catLoading } = useCategoriesStore();
    const { habits, fetchHabits, loading: habitsLoading, deleteHabit } = useHabitStore();

    useEffect(() => {
        fetchCategories();
        fetchHabits();
    }, [fetchCategories, fetchHabits]);

    if (catLoading || habitsLoading) {
        return <Loader />;
    }

    const category = categories.find(
        (c) => toUrlName(c.name) === name
    );

    if (!category) {
        return <div style={{ padding: 20 }}>⚠ Category not found</div>;
    }

    const habitsInCategory = habits.filter(
        (h) => String(h.categoryId) === String(category._id)
    );

    const handleEdit = (habitId: string) => {
        console.log("Edit habit:", habitId);
    };

    const handleDelete = async (habitId: string) => {
        if (confirm("Are you sure you want to delete this habit?")) {
            await deleteHabit(habitId);
            await fetchHabits(); 
        }
    };

    return (
        <div style={{ padding: "16px" }}>
            <h1 style={{ fontSize: "1.6rem", marginBottom: "8px" }}>
                {category.name}
            </h1>

            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                Habits in this category
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {habitsInCategory.map((habit) => (
                    <HabitItem 
                        key={habit.id} 
                        habit={habit}
                        onEdit={() => handleEdit(habit.id)}
                        onDelete={() => handleDelete(habit.id)}
                    />
                ))}
            </div>

            {habitsInCategory.length === 0 && (
                <p style={{ marginTop: "20px", color: "#9ca3af" }}>
                    No habits in this category yet.
                </p>
            )}
        </div>
    );
}
