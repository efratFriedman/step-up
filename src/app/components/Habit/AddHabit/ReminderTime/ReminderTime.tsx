"use client";
import React from 'react';
import styles from './ReminderTime.module.css';
import { IReminderTime } from '@/lib/validation/habitValidation'; 

interface ReminderTimeProps {
    value: IReminderTime | null | undefined; 
    onChange: (value: IReminderTime | null) => void; 
    error?: any;
}

export default function ReminderTime({ value, onChange, error }: ReminderTimeProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const timeStr = e.target.value;
        if (!timeStr) {
          onChange(null);
          return;
        }
    
        const [hourStr, minuteStr] = timeStr.split(":");
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
    
        onChange({ hour, minute });
      };
    
      const formattedValue =
      value && value.hour !== undefined && value.minute !== undefined
        ? `${value.hour.toString().padStart(2, "0")}:${value.minute
            .toString()
            .padStart(2, "0")}`
        : "";

        return (
            <div className={styles.inputWrapper}>
              <div className={styles.timeDisplay}>
        
                <input
                  type="time"
                  className={styles.timePicker}
                  value={formattedValue}
                  onChange={handleChange}
                />
              </div>
        
              {error && <p className={styles.error}>{error.message}</p>}
            </div>
          );
}