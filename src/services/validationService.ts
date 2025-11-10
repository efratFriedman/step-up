import { z } from "zod";

export function isValidEmail(email: string): boolean {
  const schema = z.string().email();
  return schema.safeParse(email).success;
}

export function isValidPassword(password: string): boolean {
  const schema = z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
      "Password must contain at least one uppercase, lowercase, number and special character"
    );
  return schema.safeParse(password).success;
}



export function isValidPhone(phone: string): boolean {
  const cleanedPhone = phone.trim().replace(/[-\s]/g, ""); 
  const schema = z
    .string()
    .regex(/^(\+972|0)([234589]|5[0-9])\d{7}$/, "Invalid Israeli phone number");
  return schema.safeParse(cleanedPhone).success;
}

export function isValidBirthDate(birthDate: string): boolean {
  const schema = z
    .string()
    .refine((dateStr) => {
      const date = new Date(dateStr);
      const now = new Date();
      if (isNaN(date.getTime()) || date > now) return false;

      const age = now.getFullYear() - date.getFullYear();
      return age >= 8;
    }, "User must be at least 8 years old");

  return schema.safeParse(birthDate).success;
}

