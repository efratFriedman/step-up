"use client";

import { useState, useEffect } from "react";
import { ICategory } from "@/interfaces/ICategory";
import HabitForm from "../HabitForm/HabitForm";

export default function HabitsContainer() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    // fetch("/api/categories")
    //   .then(res => res.json())
    //   .then(data => setCategories(data));
  }, []);

  const handleAddHabit = (data: any) => {
    console.log("Adding habit:", data);
    // כאן אפשר גם לשמור ב-Zustand או לשלוח ל-API
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
