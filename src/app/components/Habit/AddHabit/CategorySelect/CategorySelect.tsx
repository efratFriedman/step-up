"use client";
import { useState } from 'react';
import styles from './CategorySelect.module.css';
import { ICategory } from '@/interfaces/ICategory';

interface CategorySelectProps {
    categories: ICategory[];
    value: string; 
    onChange: (value: string) => void; 
    error?: any; 
}

export default function CategorySelect({ categories, value, onChange, error }: CategorySelectProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCategory = categories.find(cat => cat._id === value);
    const displayValue = selectedCategory ? selectedCategory.name : "Choose category";
    const displayColor = selectedCategory ? selectedCategory.colorTheme : 'transparent';

    const handleSelect = (categoryId: string) => {
        onChange(categoryId); 
        setIsOpen(false);     
    };

    return (
        <div className={styles.container}>
            <div 
                className={styles.dropdownHeader} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span 
                    className={styles.colorCircle} 
                    style={{ backgroundColor: displayColor }}
                ></span>
                {displayValue}
                <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
            </div>

            {isOpen && (
                <div className={styles.optionsList}>
                    {categories.map(category => (
                        <div 
                            key={category._id} 
                            className={`${styles.optionItem} ${category._id === value ? styles.selected : ''}`}
                            onClick={() => handleSelect(category._id)}
                        >
                            <span 
                                className={styles.colorCircle} 
                                style={{ backgroundColor: category.colorTheme || 'gray' }}
                            ></span>
                            <span>{category.name}</span>
                            {category._id === value && <span className={styles.checkMark}>✓</span>}
                        </div>
                    ))}
                </div>
            )}
            
            {error && <p className={styles.error}>{error.message}</p>}
        </div>
    );
}