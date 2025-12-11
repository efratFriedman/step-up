"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitFormData, habitSchema } from "@/lib/validation/habitValidation";
import { ICategory } from "@/interfaces/ICategory";
import TargetDays from "../TargetDays/TargetDays";
import CategorySelect from "../CategorySelect/CategorySelect";
import ReminderTime from "../ReminderTime/ReminderTime";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { useUserStore } from "@/app/store/useUserStore";

import { motion, AnimatePresence } from "framer-motion";
import styles from '@/app/components/Habit/AddHabit/HabitForm/HabitForm.module.css'

interface HabitFormOverlayProps {
    isOpen: boolean;
    categories: ICategory[];
    onSubmit: (data: HabitFormData) => void;
    onCancel: () => void;
    initialData?: Partial<HabitFormData>;
  }

  export default function HabitFormOverlay({
    isOpen, categories, onSubmit,onCancel,initialData,}: HabitFormOverlayProps) {
    const router = useRouter();
    const user = useUserStore((state) => state.user);
    const isEditMode = !!initialData;
    
    const { register, handleSubmit, control, formState, reset } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: "",
            description: "",
            categoryId: "",
            reminderTime: null,
            days: [false, false, false, false, false, false, false]
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name || "",
                description: initialData.description || "",
                categoryId: initialData.categoryId || "",
                reminderTime: initialData.reminderTime || null,
                days: initialData.days || [false, false, false, false, false, false, false]
            });
        }
    }, [initialData, reset]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleFormSubmit = async (data: HabitFormData) => {
        if (!user) {
            router.push(ROUTES.LOGIN);
            return;
        }

        setIsSubmitting(true);

        if (!isEditMode) {
            confetti({
                particleCount: 150,
                spread: 90,
                origin: { y: 0.6 },
                colors: ["#AAD1DA", "#006E8C", "#ffffff"],
            });
        }

        await onSubmit(data);
        setIsSubmitting(false);
        onCancel();
    };

    return (
        <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(2px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className={styles.formContainer}
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={onCancel}
              >
                ×
              </button>
  
              <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Habit name</label>
                  <input
                    {...register("name")}
                    className={styles.input}
                  />
                  {formState.errors.name && (
                    <p className={styles.error}>{formState.errors.name.message}</p>
                  )}
                </div>
  
                <div className={styles.formGroup}>
                  <label className={styles.label}>Description (Optional)</label>
                  <textarea
                    {...register("description")}
                    className={styles.textarea}
                    placeholder="Add more details about your habit..."
                    rows={3}
                  />
                  {formState.errors.description && (
                    <p className={styles.error}>{formState.errors.description.message}</p>
                  )}
                </div>
  
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <CategorySelect
                        categories={categories}
                        value={field.value}
                        onChange={field.onChange}
                        error={formState.errors.categoryId}
                      />
                    )}
                  />
                </div>
  
                <div className={styles.formGroup}>
                  <label className={styles.label}>Reminder time</label>
                  <Controller
                    name="reminderTime"
                    control={control}
                    render={({ field }) => (
                      <ReminderTime
                        value={field.value}
                        onChange={field.onChange}
                        error={formState.errors.reminderTime}
                      />
                    )}
                  />
                </div>
  
                <TargetDays control={control} name="days" error={formState.errors.days} />
  
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isEditMode ? "Update Habit" : "Add Habit"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
}