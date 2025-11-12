"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitFormData, habitSchema } from "@/lib/validation/habitValidation";
import { ICategory } from "@/interfaces/ICategory";
import TargetDays from "../TargetDays/TargetDays";
import styles from '@/app/components/Habit/AddHabit/HabitForm/HabitForm.module.css'
import CategorySelect from "../CategorySelect/CategorySelect";
import ReminderTime from "../ReminderTime/ReminderTime";
interface HabitFormProps {
    categories: ICategory[];
    onSubmit: (data: HabitFormData) => void;
    onCancel?: () => void;
}

export default function HabitForm({ categories, onSubmit, onCancel }: HabitFormProps) {
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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
            <button type="submit" className={styles.submitButton}>Add Habit</button>
            <button type="button" onClick={onCancel} className={styles.cancelButton}>
                Cancel
            </button>
        </form>
    )
}