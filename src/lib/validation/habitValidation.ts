import { z } from "zod";

const TimeSchema = z.object({
    hour: z.number().int().min(0).max(23),
    minute: z.number().int().min(0).max(59),
}).nullable();

export const habitSchema = z.object({
    name: z.string().min(1, "must b fill habit name"),
    description: z.string().optional(),
    categoryId: z.string().min(1, "must be choose category"),
    reminderTime: TimeSchema,
    days: z
        .array(z.boolean())
        .length(7, "must choose days")
        .refine(arr => arr.some(v => v), "must choose at least one day"),
});

export type HabitFormData = z.infer<typeof habitSchema>;

export interface IReminderTime {
    hour: number;
    minute: number;
}