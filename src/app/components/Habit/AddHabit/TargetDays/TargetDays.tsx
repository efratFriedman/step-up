"use client";

import { Control, Controller } from "react-hook-form";
import styles from './TargetDays.module.css';

interface TargetDaysProps {
    control: Control<any>;
    name?: string; 
    error?: any;
}

const days = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ,"Sun"];

export default function TargetDays({ control, name = "days", error }: TargetDaysProps) {
    return (
        <div className={styles.targetDaysContainer}>
            <label className={styles.label}>Target Days</label>
            <Controller
                control={control}
                name={name}
                render={({ field: { value, onChange } }) => (
                    <div className={styles.daysWrapper}>
                        {days.map((day, index) => (
                            <button
                                key={index}
                                type="button"
                                className={`${styles.dayButton} ${value[index] ? styles.selectedDay : styles.unselectedDay}`}
                                onClick={() => {
                                    const newValue = [...value];
                                    newValue[index] = !newValue[index];
                                    onChange(newValue);
                                }}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                )}
            />
            {error && <p className={styles.error}>{error.message}</p>}
        </div>
    );
}