"use client";

import { useEffect } from "react";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { useHabitStore } from "@/app/store/useHobbyStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useModalStore } from "@/app/store/useModalStore";
import styles from "./NewHabit.module.css";

export default function NewHabit() {
  const isHabitModalOpen = useModalStore((state) => state.isHabitModalOpen);
  const closeHabitModal = useModalStore((state) => state.closeHabitModal);
  const addHabit = useHabitStore((state) => state.addHabit);
  const { categories, fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddHabit = async (data: any) => {
    const userId = localStorage.getItem("userId") || "";

    await addHabit({
      userId,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      reminderTime: data.reminderTime,
      days: data.days
    });

    closeHabitModal();
  };

  if (!isHabitModalOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <HabitForm
          categories={categories}
          onSubmit={handleAddHabit}
          onCancel={closeHabitModal}
        />
      </div>
    </div>
  );
}
