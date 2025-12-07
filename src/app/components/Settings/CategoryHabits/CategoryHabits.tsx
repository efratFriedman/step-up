"use client";

import { useEffect, useState } from "react";
import { toUrlName } from "@/app/components/Settings/CategoryItem/CategoryItem";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitStore } from "@/app/store/useHabitStore";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import { IHabit } from "@/interfaces/IHabit";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import HabitsListDisplay from "../HabitsListDisplay/HabitsListDisplay";
import styles from "@/app/components/Settings/CategoryHabits/CategoryHabits.module.css";
import { X } from "lucide-react";

interface CategoryHabitsProps {
    routeName: string;
}

export default function CategoryHabits({ routeName }: CategoryHabitsProps) {
    const router = useRouter();
    const [editingHabit, setEditingHabit] = useState<IHabit | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const { categories, fetchCategories, loading: catLoading } = useCategoriesStore();
    const { habits, fetchHabits, loading: habitsLoading, deleteHabit, updateHabit } = useHabitStore();

    useEffect(() => {
        fetchCategories();
        fetchHabits();
    }, [fetchCategories, fetchHabits]);

    // Loading State
    if (catLoading || habitsLoading) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p className={styles.loadingText}>Loading habits...</p>
                </div>
            </div>
        );
    }

    const category = categories.find(
        (c) => toUrlName(c.name) === routeName
    );

    // Error State - Category Not Found
    if (!category) {
        return (
            <div className={styles.wrapper}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2 className={styles.errorTitle}>Category Not Found</h2>
                    <p className={styles.errorMessage}>
                        The category you're looking for doesn't exist.
                    </p>
                    <button 
                        className={styles.errorButton}
                        onClick={() => router.push('/settings')}
                    >
                        Go Back to Settings
                    </button>
                </div>
            </div>
        );
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
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <HabitsListDisplay
                    category={category}
                    habitsInCategory={habitsInCategory}
                    openMenuId={openMenuId}
                    onToggleMenu={toggleMenu}
                    onCloseMenu={closeMenu}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onGoBack={() => router.push('/settings')}
                />

                {/* Edit Modal */}
                {editingHabit && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>Edit Habit</h2>
                                <button 
                                    className={styles.modalClose}
                                    onClick={() => setEditingHabit(null)}
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            
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
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}