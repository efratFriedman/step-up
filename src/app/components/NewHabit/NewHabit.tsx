"use client";

import { useState, useEffect } from "react";
import { ICategory } from "@/interfaces/ICategory";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { useHabitStore } from "@/app/store/useHobbyStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";

export default function HabitsContainer() {
  const [isOpen, setIsOpen] = useState(false); 
  const { categories, fetchCategories } = useCategoriesStore();
  const addHabit = useHabitStore((state) => state.addHabit);

  useEffect(() => {
    if (categories.length === 0) fetchCategories(); 
  }, [categories, fetchCategories]);

  const handleAddHabit = async  (data: any) => {
    console.log("Adding habit:", data);
    await addHabit(data);
    setIsOpen(false); 
  };

  const handleCancel = () => {
    setIsOpen(false); 
  };

  return (
    <div>
      
      {isOpen && (
        <div>
          <div>
            <HabitForm
              categories={categories}
              onSubmit={handleAddHabit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
