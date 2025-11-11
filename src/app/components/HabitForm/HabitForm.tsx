"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HabitFormData, habitSchema } from "@/lib/validation/habitValidation";
import { ICategory } from "@/interfaces/ICategory";
interface HabitFormProps {
    categories: ICategory[];
    onSubmit: (data: HabitFormData) => void;
    onCancel?: () => void; 
}

export default function HabitForm({ categories, onSubmit,onCancel }: HabitFormProps) {
    const { register, handleSubmit, control, formState } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            habitName: "",
            description: "",
            category: "",
            targetDays: [false, false, false, false, false, false, false]
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Habit name</label>
                <input {...register("habitName")} />
                {formState.errors.habitName && <p>{formState.errors.habitName.message}</p>}
            </div>
            <div>
                <label>Description (Optional)</label>
                <textarea {...register("description")}></textarea>
                {formState.errors.description && <p>{formState.errors.description.message}</p>}
            </div>
            <div>
                <label>Category</label>
                <select {...register("category")}>
                    <option value="">choose category</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                {formState.errors.category && <p>{formState.errors.category.message}</p>}
            </div>
            {/* <TargetDays control={control} error={formState.errors.targetDays} /> */}
            <button type="submit" >Add Habit</button>
            <button type="button" onClick={onCancel}>
                Cancel
            </button>
        </form>
    )
}