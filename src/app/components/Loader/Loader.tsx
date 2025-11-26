"use client";

import { useState, useEffect } from "react";
import styles from "./Loader.module.css";
import { CIRCUMFERENCE, getStepRotation, getStepThreshold, getStepWidth, getStrokeOffset, isStepFilled } from "@/utils/loaderHelper";


export default function Loader() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 2));
        }, 50);

        return () => clearInterval(interval);
    }, []);

    const steps = [0, 1, 2, 3, 4];
    const stepThreshold = getStepThreshold(steps.length);

    return (
        <div className={styles.loaderContainer}>
            <div className={styles.loaderContent}>
                <div className={styles.circleWrapper}>
                    <svg className={styles.svg}>
                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            fill="none"
                            stroke="#bcdbdf"
                            strokeWidth="6"
                        />

                        <circle
                            cx="64"
                            cy="64"
                            r="58"
                            fill="none"
                            stroke="#2e72ac"
                            strokeWidth="6"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={getStrokeOffset(progress)}
                            strokeLinecap="round"
                            className={styles.progressCircle}
                        />
                    </svg>

                    <div className={styles.stepsCenter}>
                        <div className={styles.stepsContainer}>
                            {steps.map((step, index) => {
                                const filled = isStepFilled(
                                    progress,
                                    index,
                                    stepThreshold
                                );

                                return (
                                    <div
                                        key={step}
                                        className={styles.step}
                                        style={{
                                            width: `${getStepWidth(index)}px`,
                                            backgroundColor: filled ? "#2e72ac" : "#bcdbdf",
                                            opacity: filled ? 1 : 0.4,
                                            transform: `rotate(${getStepRotation(index)}deg)`,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles.textContainer}>
                    <h2 className={styles.title}>STEP UP</h2>
                    <p className={styles.subtitle}>Building your habits...</p>

                    <div className={styles.dotsContainer}>
                        {[0, 1, 2].map((dot) => (
                            <div
                                key={dot}
                                className={styles.dot}
                                style={{ animationDelay: `${dot * 0.2}s` }}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
