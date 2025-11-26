"use client";
import { ReactNode } from 'react';
import styles from './ErrorPageLayout.module.css';

interface ErrorPageProps {
    title: string;
    description: string;
    buttonText: string;
    icon: ReactNode;
    onButtonClick: () => void;
}

export default function ErrorPageLayout({
    title,
    description,
    buttonText,
    icon,
    onButtonClick,
}: ErrorPageProps) {
    return (
        <div className={styles.container}>

            <div className={styles.logo}>
                <img
                    src="/images/fullLogo.png"
                    alt="StepUp Logo"
                    width={200}
                    height={200}
                />

            </div>

            <div className={styles.card}>

                <div className={styles.icon}>
                    {icon}
                </div>

                <h1 className={styles.title}>
                    {title}
                </h1>

                <p className={styles.description}>
                    {description}
                </p>

                <button
                    onClick={onButtonClick}
                    className={styles.button}
                >
                    {buttonText}
                </button>
            </div>

            <div className={styles.footer}>
                StepUp - For Better Habits
            </div>
        </div>
    );
}