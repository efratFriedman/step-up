"use client";
import { useState, useEffect } from "react";
import HabitForm from "@/app/components/Habit/AddHabit/HabitForm/HabitForm";
import { useHabitStore } from "@/app/store/useHobbyStore";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";


export interface ICategoryFront {
  _id: string;
  name: string;
  image?: string;
  colorTheme?: string;
}

export interface IHabitClient {
  userId: string;
  name: string;
  description?: string;
  categoryId?: string;
  reminderTime?: { hour: number; minute: number };
  days?: string[];
}


export default function NewHabit() {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, fetchCategories } = useCategoriesStore();
  const addHabit = useHabitStore((state) => state.addHabit);

  useEffect(() => {
    if (categories.length === 0) {
      const mockCategories: ICategoryFront[] = [
        { _id: "1", name: "Health", image: "", colorTheme: "#bcdbdf" },
        { _id: "2", name: "Study", image: "", colorTheme: "#183c5c" },
        { _id: "3", name: "Hobby", image: "", colorTheme: "#99c8ce" },
      ];

      const fetchCategoriesMock = () => {
        return new Promise<ICategoryFront[]>((resolve) => {
          setTimeout(() => resolve(mockCategories), 500);
        });
      };

      fetchCategoriesMock().then((data) => fetchCategories());
    } else {
      fetchCategories();
    }
  }, [categories, fetchCategories]);

  const handleAddHabit = async (data: any) => {
    const userId = localStorage.getItem("userId") || "123456734442242890abcdef"; 

    const habitToSend: IHabitClient = {
      userId,
      name: data.habitName,
      description: data.description,
      categoryId: data.category,
      reminderTime: data.reminderTime,
      days: data.targetDays
        .map((day: boolean, index: number) =>
          day
            ? ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][index]
            : null
        )
        .filter(Boolean),
    };
    
  
    console.log("Sending habit to store:", habitToSend);
  
    await addHabit(habitToSend);
  };
  
  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button
        style={{ backgroundColor: "#AAD1DA", color: "#006E8C" }}
        onClick={() => setIsOpen(true)}
      >
        + Add Habit
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-full max-w-md relative">
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
