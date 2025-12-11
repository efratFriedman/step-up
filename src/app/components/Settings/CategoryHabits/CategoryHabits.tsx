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
import styles from "./CategoryHabits.module.css";
import { X, AlertTriangle } from "lucide-react";

interface CategoryHabitsProps {
    routeName: string;
}

export default function CategoryHabits({ routeName }: CategoryHabitsProps) {
    const router = useRouter();
    const [editingHabit, setEditingHabit] = useState<IHabit | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [deletingHabitId, setDeletingHabitId] = useState<string | null>(null);

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
        (c) => toUrlName(c.name) === routeName
    );

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

    const handleDeleteClick = (habitId: string) => {
        setDeletingHabitId(habitId);
        setOpenMenuId(null);
    };

    const handleConfirmDelete = async () => {
        if (!deletingHabitId) return;
        
        await deleteHabit(deletingHabitId);
        await fetchHabits();
        setDeletingHabitId(null);
    };

    const handleCancelDelete = () => {
        setDeletingHabitId(null);
    };

    const toggleMenu = (habitId: string) => {
        setOpenMenuId(openMenuId === habitId ? null : habitId);
    };

    const closeMenu = () => {
        setOpenMenuId(null);
    };

    const deletingHabit = habits.find(h => String(h._id) === deletingHabitId);

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
                    onDelete={handleDeleteClick}
                    onGoBack={() => router.push('/settings')}
                />

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
                                isOpen={true} 
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

                {/* Delete Confirmation Modal */}
                {deletingHabitId && (
                    <div className={styles.deleteModal}>
                        <div className={styles.deleteContent}>
                            <div className={styles.deleteIcon}>
                                <AlertTriangle size={32} color="#dc2626" />
                            </div>
                            <h2 className={styles.deleteTitle}>Delete Habit?</h2>
                            <p className={styles.deleteMessage}>
                                Are you sure you want to delete <strong>"{deletingHabit?.name}"</strong>? 
                                This action cannot be undone.
                            </p>
                            <div className={styles.deleteActions}>
                                <button 
                                    className={styles.deleteCancel}
                                    onClick={handleCancelDelete}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className={styles.deleteConfirm}
                                    onClick={handleConfirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}