"use client";

import { useRouter } from "next/navigation";
import styles from '@/app/components/Settings/CategoryItem/CategoryItem.module.css'
interface Props {
    id: string;
    name: string;
    image: string;
    color: string;
}
export function hexToRGBA(hex: string, opacity: number) {
    let c = hex.replace("#", "");

    if (c.length === 3) {
        c = c.split("").map((x) => x + x).join("");
    }

    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
 export function toUrlName(name: string) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-") 
        .replace(/[^a-zא-ת0-9\-]/gi, ""); 
}
export default function CategoryItem({ id, name, image, color }: Props) {
    const router = useRouter();

    const bgColor = hexToRGBA ? hexToRGBA(color, 0.25) : color;

    return (
        <div
            className={styles.container}
            style={{ backgroundColor: bgColor }}
            onClick={() => router.push(`/settings/${toUrlName(name)}`)}
        >
            <img src={image} alt={name} className={styles.icon} />
            <span className={styles.label}>{name}</span>
        </div>);
}
