"use client";
import { useState, useEffect } from "react";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { IHabitClient, useHabitStore } from "@/app/store/useHobbyStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useRouter } from "next/navigation";
import styles from './NewHabit.module.css';

export default function NewHabit() {
  const isHabitModalOpen = useModalStore((state) => state.isHabitModalOpen);
  const { categories, fetchCategories } = useCategoriesStore();
  const addHabit = useHabitStore((state) => state.addHabit);
  const closeHabitModal = useModalStore((state) => state.closeHabitModal)
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddHabit = async (data: any) => {
    const userId = localStorage.getItem("userId");

    const habitToSend = {
      userId: userId || "",
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      reminderTime: data.reminderTime,
      days: data.days
    };

    console.log("Sending habit to store:", habitToSend);

    await addHabit(habitToSend);
  };

  if (!isHabitModalOpen) { return null }

  return (
    <div className={styles.overlay}>
      <div className={styles.modalContainer}>
        <HabitForm
          categories={categories}
          onSubmit={handleAddHabit}
          onCancel={() => closeHabitModal()}
        />
      </div>
    </div>
  );
}
