"use client";
import { useEffect } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitAppStore } from "@/app/store/habitAppStore/store";
import { useModalStore } from "@/app/store/useModalStore";
import { useUserStore } from "@/app/store/useUserStore";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";

export default function NewHabit() {
  const isHabitModalOpen = useModalStore((state) => state.isHabitModalOpen);
  const closeHabitModal = useModalStore((state) => state.closeHabitModal);
  const addHabit = useHabitAppStore((s) => s.addHabit);  
  const { categories, fetchCategories } = useCategoriesStore();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddHabit = async (data: any) => {
    if (!user?.id) return;

    await addHabit({
      userId: user.id,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      reminderTime: data.reminderTime,
      days: data.days,
    });
    closeHabitModal();
  };

  if (!isHabitModalOpen) return null;

  return (
    <HabitForm
      isOpen={isHabitModalOpen}  
      categories={categories}
      onSubmit={handleAddHabit}
      onCancel={closeHabitModal}
    />
  );
}
