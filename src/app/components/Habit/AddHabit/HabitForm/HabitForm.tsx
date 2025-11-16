"use client";
import { useState } from "react";
import confetti from "canvas-confetti";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitFormData, habitSchema } from "@/lib/validation/habitValidation";
import { ICategory } from "@/interfaces/ICategory";
import TargetDays from "../TargetDays/TargetDays";
import styles from '@/app/components/Habit/AddHabit/HabitForm/HabitForm.module.css'
import CategorySelect from "../CategorySelect/CategorySelect";
import ReminderTime from "../ReminderTime/ReminderTime";
import { useRouter } from "next/navigation";

interface HabitFormProps {
    categories: ICategory[];
    onSubmit: (data: HabitFormData) => void;
    onCancel?: () => void;
}

export default function HabitForm({ categories, onSubmit, onCancel }: HabitFormProps) {
    const router = useRouter();
    const { register, handleSubmit, control, formState } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: "",
            description: "",
            categoryId: "",
            reminderTime: null,
            days: [false, false, false, false, false, false, false]
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleCancelClick = () => {
    setIsClosing(true); 
    setTimeout(() => {
        onCancel?.();
    }, 300);
    };


    const handleFormSubmit = async (data: HabitFormData) => {

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          router.push("/login");
          return;
        }
        setIsSubmitting(true);
      
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ["#AAD1DA", "#006E8C", "#ffffff"],
        });
      
        onSubmit(data);
        setIsSubmitting(false);
      };
      

    return (
        <div className={styles.overlay}>
        <div
            className={`${styles.formContainer} ${isClosing ? styles.closing : ""}`}
        >
            {onCancel && (
            <button
                type="button"
                className={styles.closeButton}
                onClick={handleCancelClick}
            >
                ×
            </button>
            )}
          <form onSubmit={handleSubmit(handleFormSubmit)} className={styles.form}>       
         <div className={styles.formGroup}>
                <label className={styles.label}>Habit name</label>
                <input
                    {...register("name")}
                    className={styles.input}
                />
                {formState.errors.name && <p className={styles.error}>{formState.errors.name.message}</p>}
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Description (Optional)</label>
                <textarea
                    {...register("description")}
                    className={styles.textarea}
                    placeholder="Add more details about your habit..."
                    rows={3}
                ></textarea>
                {formState.errors.description && <p className={styles.error}>{formState.errors.description.message}</p>}
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
            > Add Habit
            </button>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
                Cancel
            </button>
            </form>
         </div>
     </div>
    )
}