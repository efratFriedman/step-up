"use client";
import { useState, useEffect } from "react";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { IHabitClient, useHabitStore } from "@/app/store/useHobbyStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import { useModalStore } from "@/app/store/useModalStore";
import { useRouter } from "next/navigation";

export default function NewHabit() {
  const isHabitModalOpen=useModalStore((state)=>state.isHabitModalOpen);
  const { categories, fetchCategories } = useCategoriesStore();
  const addHabit = useHabitStore((state) => state.addHabit);
  const closeHabitModal=useModalStore((state)=>state.closeHabitModal)
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, [categories, fetchCategories]);

  const handleAddHabit = async (data: any) => {

    const token = localStorage.getItem("token");
    console.log("Retrieved token from localStorage:", token);
    if (!token) {
      console.error("No token found in localStorage");
      router.push("/login");
      return;
    }
    const userId = localStorage.getItem("userId") || "123456734442242890abcdef";

    const habitToSend: IHabitClient = {
      userId,
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      reminderTime: data.reminderTime,
      days: data.days
    };


    console.log("Sending habit to store:", habitToSend);

    await addHabit(habitToSend);
  };

  const handleCancel = () => {
    closeHabitModal()
  };

  return (
    <div>
      {/* <button
        style={{ backgroundColor: "#AAD1DA", color: "#006E8C" }}
        onClick={() => setIsOpen(true)}
      >
        + Add Habit
      </button> */}

      {isHabitModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
            <HabitForm
              categories={categories}
              onSubmit={handleAddHabit}
              onCancel={()=>closeHabitModal()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
