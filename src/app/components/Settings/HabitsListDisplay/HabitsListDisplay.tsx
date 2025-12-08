import { IHabit } from "@/interfaces/IHabit";
import { ICategory } from "@/interfaces/ICategory";
import { ArrowLeft } from "lucide-react";
import HabitItem from "@/app/components/Settings/HabitItem/HabitItem";
import styles from "@/app/components/Settings/HabitsListDisplay/HabitsListDisplay.module.css";

interface HabitsListDisplayProps {
    category: ICategory;
    habitsInCategory: IHabit[];
    openMenuId: string | null;
    onToggleMenu: (habitId: string) => void;
    onCloseMenu: () => void;
    onEdit: (habit: IHabit) => void;
    onDelete: (habitId: string) => void;
    onGoBack: () => void;
}

export default function HabitsListDisplay({
    category,
    habitsInCategory,
    openMenuId,
    onToggleMenu,
    onCloseMenu,
    onEdit,
    onDelete,
    onGoBack
}: HabitsListDisplayProps) {
    return (
        <div className={styles.container}>
            <button onClick={onGoBack} className={styles.backButton}>
                <ArrowLeft size={16} />
                Back
            </button>

            {/* Header Section */}
            <div className={styles.header}>
                <h1 className={styles.title}>{category.name}</h1>
            </div>

            {/* Habits List */}
            <div className={styles.habitsList}>
                {habitsInCategory.map((habit) => (
                    <HabitItem
                        key={String(habit._id)}
                        habit={habit}
                        isMenuOpen={openMenuId === String(habit._id)}
                        onToggleMenu={() => onToggleMenu(String(habit._id))}
                        onCloseMenu={onCloseMenu}
                        onEdit={() => onEdit(habit)}
                        onDelete={() => onDelete(String(habit._id))}
                    />
                ))}
            </div>

            {/* Empty State */}
            {habitsInCategory.length === 0 && (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>📋</div>
                    <p className={styles.emptyText}>
                        No habits in this category yet
                    </p>
                    <p className={styles.emptyHint}>
                        Add your first habit to get started
                    </p>
                </div>
            )}
        </div>
    );
}