"use client";

import { useEffect, useState } from "react";
import { toUrlName } from "@/app/components/Settings/CategoryItem/CategoryItem";
import HabitItem from "@/app/components/Settings/HabitItem/HabitItem";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitStore } from "@/app/store/useHabitStore";
import { useParams } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { IHabit } from "@/interfaces/IHabit";

export default function CategoryPage() {
    const { name } = useParams();
    const [editingHabit, setEditingHabit] = useState<IHabit | null>(null);

    const { categories, fetchCategories, loading: catLoading } = useCategoriesStore();
    const { habits, fetchHabits, loading: habitsLoading, deleteHabit, updateHabit } = useHabitStore();

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

    const handleEdit = (habit: IHabit) => {
        setEditingHabit(habit);
    };

    const handleUpdateHabit = async (data: any) => {
        if (!editingHabit?._id) return;

        await updateHabit(editingHabit.id, {
            name: data.name,
            description: data.description,
            categoryId: data.categoryId,
            reminderTime: data.reminderTime,
            days: data.days,
        });

        // Refresh the list
        await fetchHabits();
        setEditingHabit(null);
    };

    const handleDelete = async (habitId: string) => {
        if (confirm("Are you sure you want to delete this habit?")) {
            await deleteHabit(habitId);
            // Refresh the list after deletion
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
                        onEdit={() => handleEdit(habit)}
                        onDelete={() => handleDelete(habit.id)}
                    />
                ))}
            </div>

            {habitsInCategory.length === 0 && (
                <p style={{ marginTop: "20px", color: "#9ca3af" }}>
                    No habits in this category yet.
                </p>
            )}

            {/* Edit Modal */}
            {editingHabit && (
                <HabitForm
                    categories={categories}
                    onSubmit={handleUpdateHabit}
                    onCancel={() => setEditingHabit(null)}
                    initialData={{
                        name: editingHabit.name,
                        description: editingHabit.description || "",
                        categoryId: String(editingHabit.categoryId),
                        reminderTime: editingHabit.reminderTime,
                        days: editingHabit.days || [false, false, false, false, false, false, false]
                    }}
                />
            )}
        </div>
    );
}
