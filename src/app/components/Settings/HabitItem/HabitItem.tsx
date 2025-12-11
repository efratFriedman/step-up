"use client";

import { IHabit } from "@/interfaces/IHabit";
import styles from "@/app/components/Settings/HabitItem/HabitItem.module.css"
import { Edit, MoreVertical, Trash2 } from "lucide-react";
interface Props {
    habit: IHabit;
    isMenuOpen: boolean;
    onToggleMenu: () => void;
    onCloseMenu: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}
export default function HabitItem({ 
    habit, 
    isMenuOpen, 
    onToggleMenu, 
    onCloseMenu,
    onEdit, 
    onDelete 
}: Props) {
    const formattedTime = habit.reminderTime
        ? `${habit.reminderTime.hour
              .toString()
              .padStart(2, "0")}:${habit.reminderTime.minute
                  .toString()
                  .padStart(2, "0")}`
        : "No reminder";

    
    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onToggleMenu();
    };

    const handleMenuAction = (action: () => void) => {
        onCloseMenu(); 
        action();
    };

    return (
        <div className={styles.card} >
            <div className={styles.menuWrapper}>
                <MoreVertical
                    className={styles.menuIcon}
                    onClick={handleMenuClick}
                />

                {isMenuOpen && (
                    <div className={styles.menu}>
                        <button onClick={() => handleMenuAction(onEdit!)}>
                            <Edit size={16} />
                            Edit
                        </button>
                        <button onClick={() => handleMenuAction(onDelete!)}>
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.topRow}>
                <div className={styles.iconWrapper}>
                    <div className={styles.defaultIcon}>★</div>
                </div>

                <div className={styles.textWrapper}>
                    <h3 
                        className={styles.title} 
                        style={{ cursor: onEdit ? 'pointer' : 'default' }}
                    >
                        {habit.name}
                    </h3>

                    {habit.description && (
                        <p 
                            className={styles.description}
                            style={{ cursor: onEdit ? 'pointer' : 'default' }}
                        >
                            {habit.description}
                        </p>
                    )}
                </div>
            </div>

            <div className={styles.bottomRow}>
                <span className={styles.time}>{formattedTime}</span>
            </div>
        </div>
    );
}