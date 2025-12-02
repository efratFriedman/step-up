"use client";

import { useCategoriesStore } from "@/app/store/useCategoriesStore";
import CategoryItem from "../CategoryItem/CategoryItem";


export default function CategoriesPreview() {
    const categories = useCategoriesStore((state) => state.categories);

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "20px",
                padding: "20px",
            }}
        >
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
    );
}
