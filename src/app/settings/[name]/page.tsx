"use client";

import { useEffect, useState } from "react";
import { toUrlName } from "@/app/components/Settings/CategoryItem/CategoryItem";
import HabitItem from "@/app/components/Settings/HabitItem/HabitItem";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitStore } from "@/app/store/useHabitStore";
import { useParams, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { IHabit } from "@/interfaces/IHabit";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
    const { name } = useParams();
    const router = useRouter();
    const [editingHabit, setEditingHabit] = useState<IHabit | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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

    console.log("🔥 habitsInCategory:", habitsInCategory);

    const handleEdit = (habit: IHabit) => {
        setEditingHabit(habit);
        setOpenMenuId(null); // Close menu when opening edit modal
    };

    const handleUpdateHabit = async (data: any) => {
        if (!editingHabit?._id) return;

        await updateHabit(editingHabit._id.toString(), {
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
        console.log("🛑 DELETE CLICKED WITH ID:", habitId); // <--- כאן

        if (confirm("Are you sure you want to delete this habit?")) {
            await deleteHabit(habitId);
            // Refresh the list after deletion
            await fetchHabits();
        }
    };

    const toggleMenu = (habitId: string) => {
        setOpenMenuId(openMenuId === habitId ? null : habitId);
    };

    const closeMenu = () => {
        setOpenMenuId(null);
    };

    return (
        <div style={{ padding: "16px" }}>
            {/* Back Arrow Button */}
            <button
                onClick={() => router.push('/settings')}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '16px',
                    color: '#6b7280',
                    fontSize: '14px'
                }}
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <h1 style={{ fontSize: "1.6rem", marginBottom: "8px" }}>
                {category.name}
            </h1>

            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                Habits in this category
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {habitsInCategory.map((habit) => (
                    <HabitItem
                        key={String(habit!._id)}
                        habit={habit}
                        isMenuOpen={openMenuId === String(habit._id)}
                        onToggleMenu={() => toggleMenu(String(habit._id))}
                        onCloseMenu={closeMenu}
                        onEdit={() => handleEdit(habit)}
                        onDelete={() => handleDelete(String(habit._id))}
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
