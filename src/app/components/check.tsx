"use client"
import Image from "next/image";
import { useCategoriesStore } from "../store/useCategoriesStore";

export default function CategoriesPreview() {
    const categories=useCategoriesStore((state)=>state.categories)
 // פונקציה להמרת HEX ל-RGBA עם שקיפות עדינה
function hexToRGBA(hex: string, opacity: number) {
  let c: any = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x: any) => x + x).join("");
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

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
        <div
          key={cat.name}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "15px",
            borderRadius: "18px",
            background: hexToRGBA(cat.colorTheme!, 0.25), // ✨ שקיפות עדינה
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <img src={cat.image!} alt={cat.name} width={50} height={50} />
          <span style={{ marginTop: "10px", fontSize: "15px" }}>{cat.name}</span>
        </div>
      ))}
    </div>
  );
}