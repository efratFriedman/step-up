"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  isOnboardingActive: boolean;
  hasStarted: boolean;
  hasCreatedFirstHabit: boolean;

  start: () => void;
  finish: () => void;
  setFirstHabitCreated: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingActive: false,
      hasStarted: false,
      hasCreatedFirstHabit: false,

      start: () => set({ isOnboardingActive: true, hasStarted: true }),
      finish: () => set({ isOnboardingActive: false }),
      setFirstHabitCreated: () => set({ hasCreatedFirstHabit: true }),
    }),
    {
      name: "onboarding-storage", 
    }
  )
);
