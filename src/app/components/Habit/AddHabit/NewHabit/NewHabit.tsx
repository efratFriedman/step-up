"use client";
import { useEffect } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useHabitStore } from "@/app/store/useHabitStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useUserStore } from "@/app/store/useUserStore";
import { useTodayHabitStore } from "@/app/store/useTodayHabitStore";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";

export default function NewHabit() {
  const isHabitModalOpen = useModalStore((state) => state.isHabitModalOpen);
  const closeHabitModal = useModalStore((state) => state.closeHabitModal);
  const addHabit = useHabitStore((state) => state.addHabit);
  const { categories, fetchCategories } = useCategoriesStore();
  const user = useUserStore((state) => state.user);
  const fetchTodayHabits = useTodayHabitStore((state) => state.fetchTodayHabits);

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

    await fetchTodayHabits(new Date().toISOString().split("T")[0]);

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
