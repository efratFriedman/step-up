import { z } from "zod";

export const habitSchema = z.object({
    habitName: z.string().min(1, "must b fill habit name"),
    description: z.string().optional(),
    category: z.string().min(1, "must be choose category"),
    targetDays: z
        .array(z.boolean())
        .length(7, "must choose days")
        .refine(arr => arr.some(v => v), "must choose at least one day")
});

export type HabitFormData = z.infer<typeof habitSchema>;
