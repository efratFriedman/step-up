"use client";

import { useEffect, useState } from "react";
import { toUrlName } from "@/app/components/Settings/CategoryItem/CategoryItem";
import HabitItem from "@/app/components/Settings/HabitItem/HabitItem";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitStore } from "@/app/store/useHabitStore";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { IHabit } from "@/interfaces/IHabit";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage() {
    // ❗ שליפה יציבה של שם הקטגוריה מה-URL
    const pathname = usePathname();            // "/settings/health"
    const routeName = pathname.split("/").pop();  // "health"

    if (!routeName) return <Loader />;  // מגן מתקלות פרודקשן

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

    // ❗ עכשיו routeName תמיד תקין
    const category = categories.find(
        (c) => toUrlName(c.name) === routeName
    );

    if (!category) {
        return <div style={{ padding: 20 }}>⚠ Category not found</div>;
    }

    const habitsInCategory = habits.filter(
        (h) => String(h.categoryId) === String(category._id)
    );

    const handleEdit = (habit: IHabit) => {
        setEditingHabit(habit);
        setOpenMenuId(null);
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

        await fetchHabits();
        setEditingHabit(null);
    };

    const handleDelete = async (habitId: string) => {
        console.log("🛑 DELETE CLICKED WITH ID:", habitId);

        if (confirm("Are you sure you want to delete this habit?")) {
            await deleteHabit(habitId);
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
