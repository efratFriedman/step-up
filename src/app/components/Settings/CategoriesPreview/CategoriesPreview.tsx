"use client";

import { useEffect } from "react";
import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import CategoryItem from "../CategoryItem/CategoryItem";
import styles from "@/app/components/Settings/CategoriesPreview/CategoriesPreview.module.css";
import Loader from "../../Loader/Loader";

export default function CategoriesPreview() {
    const { categories, fetchCategories, loading } = useCategoriesStore();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    if (loading) {
        return <Loader />;
    }

    if (!categories.length) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyContainer}>
                    <div className={styles.emptyIcon}>📂</div>
                    <h3 className={styles.emptyTitle}>No Categories Yet</h3>
                    <p className={styles.emptyText}>
                        Create your first category to organize your habits
                    </p>
                    <button className={styles.emptyButton}>
                        Add Category
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                {categories.map((cat) => (
                    <CategoryItem
                        key={cat._id}
                        id={cat._id}
                        name={cat.name}
                        image={cat.image!}
                        color={cat.colorTheme!}
                    />
                ))}
            </div>
        </div>
    );
}