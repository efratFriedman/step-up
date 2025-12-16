"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
    isOnboardingActive: boolean;
    currentStep: number;

    start: () => void;
    finish: () => void;
    goToStep: (index: number) => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            isOnboardingActive: false,
            currentStep: 0,

            start: () => set({ isOnboardingActive: true, currentStep: 0 }),

            finish: () => set({ isOnboardingActive: false, currentStep: 0 }),

            goToStep: (index) => set({ currentStep: index }),
        }),

        {
            name: "onboarding-storage",
            partialize: (state) => ({
                isOnboardingActive: state.isOnboardingActive,
                currentStep: state.currentStep,
            }),
        }
    )
);