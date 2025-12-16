"use client";

import { useEffect, useRef } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";

import { useUserStore } from "@/app/store/useUserStore";
import { useOnboardingStore } from "@/app/store/useOnboardingStore";
import { homeSteps } from "./steps/homeSteps";
import { finishOnboardingService } from "@/services/client/userService";

export default function OnboardingProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const onboarding = useOnboardingStore();
    const user = useUserStore((s) => s.user);
    const updateUserField = useUserStore((s) => s.updateUserField);

    const tourRef = useRef<any>(null);
    const stepsBuiltRef = useRef(false);

    async function finishOnboarding() {
        if (!onboarding.isOnboardingActive) return;
        if (!user?.isFirstLogin) return;

        try {
            await finishOnboardingService();
        } catch (e) {
            console.error("finishOnboardingService failed", e);
        }

        updateUserField("isFirstLogin", false);
        onboarding.finish();
    }


    useEffect(() => {
        const tour = new Shepherd.Tour({
            defaultStepOptions: {
                cancelIcon: { enabled: true },
                scrollTo: false,
                canClickTarget: true,
            },
            useModalOverlay: true,
        });

        tour.on("complete", finishOnboarding);
        tour.on("cancel", finishOnboarding);

        tourRef.current = tour;

        return () => {
            tour.cancel();
            tourRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!user) return;
        if (!user.isFirstLogin) return;
        if (onboarding.isOnboardingActive) return;

        onboarding.start();
    }, [user, onboarding.isOnboardingActive, onboarding]);

    useEffect(() => {
        if (!onboarding.isOnboardingActive) return;
        if (!tourRef.current) return;
        if (stepsBuiltRef.current) return;

        const tour = tourRef.current;

        const steps = homeSteps(false);

        steps.forEach((step, index) => {
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
                        },
                    },
                    {
                        text: index === steps.length - 1 ? "Finish" : "Next",
                        action() {
                            tour.next();
                        },
                    },
                ],
            });
        });

        stepsBuiltRef.current = true;

        setTimeout(() => {
            if (!tour.isActive()) {
                tour.start();
            }
        }, 50);
    }, [onboarding.isOnboardingActive]);

    return <>{children}</>;
}
