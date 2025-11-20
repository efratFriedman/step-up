"use client";
import { useEffect } from "react";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { useHabitStore } from "@/app/store/useHobbyStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useUserStore } from "@/app/store/useUserStore";

export default function NewHabit() {
  const isHabitModalOpen = useModalStore((state) => state.isHabitModalOpen);
  const closeHabitModal = useModalStore((state) => state.closeHabitModal);
  const addHabit = useHabitStore((state) => state.addHabit);
  const { categories, fetchCategories } = useCategoriesStore();
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddHabit = async (data: any) => {
    const userId = localStorage.getItem("userId") || "";
    console.log(data.days);
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
        <HabitForm
          categories={categories}
          onSubmit={handleAddHabit}
          onCancel={closeHabitModal}
        />
    
  );
}