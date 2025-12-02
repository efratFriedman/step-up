"use client";


import { useParams } from "next/navigation";

export default function CategoryPage() {
    const { name } = useParams();
    return (
        <h1>welcome to {name} category</h1>
    );
}