"use client";

import { useEffect, useRef } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

import { useUserStore } from "@/app/store/useUserStore";
import { useHabitAppStore } from "@/app/store/habitAppStore/store";
import { useOnboardingStore } from "../store/useOnboardingStore";
import { homeSteps } from "./steps/homeSteps";
import { finishOnboardingService } from "@/services/client/userService";

export default function OnboardingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const onboarding = useOnboardingStore();
    const user = useUserStore((s) => s.user);
    const todayHabits = useHabitAppStore((s) => s.todayHabits);
    const updateUserField = useUserStore((s) => s.updateUserField);
    const tourRef = useRef<any>(null);

    async function finishOnboarding() {
        await finishOnboardingService();
        updateUserField("isFirstLogin", false);
        onboarding.finish();
    }

    useEffect(() => {
        const tour = new Shepherd.Tour({
            defaultStepOptions: {
                cancelIcon: { enabled: true },
                scrollTo: false,
                canClickTarget: true,
                highlightClass: "shepherd-highlight",
            },
            useModalOverlay: true,
        });

        tourRef.current = tour;
    }, []);

    useEffect(() => {
        if (!user) return;

        if (user.isFirstLogin && !onboarding.hasStarted) {
            onboarding.start();
        }
    }, [user, onboarding.hasStarted]);

    useEffect(() => {
        if (!onboarding.isOnboardingActive) return;
        if (!tourRef.current) return;

        const tour = tourRef.current;

        if (tour.isActive()) return;

        tour.steps = [];

        const steps = homeSteps(todayHabits.length > 0);

        steps.forEach((step) => {
            tour.addStep({
                id: step.id,
                title: step.title,
                text: step.text,
                attachTo: step.selector
                    ? { element: step.selector, on: step.position || "bottom" }
                    : undefined,

                buttons: [
                    {
                        text: "Skip",
                        action() {
                            tour.cancel();
                            finishOnboarding();
                        },
                    },
                    {
                        text: "Next",
                        action() {
                            tour.next();
                        },
                    },
                ],
            });
        });

        setTimeout(() => {
            if (!tour.isActive()) {
                tour.start();
            }
        }, 200);
    }, [onboarding.isOnboardingActive, todayHabits]);

    useEffect(() => {
        const tour = tourRef.current;
        if (!tour) return;

        tour.on("complete", async () => {
            await finishOnboarding();
        });

        tour.on("cancel", async () => {
            await finishOnboarding();
        });
    }, []);

    return <>{children}</>;
}
