"use client";

import { useState, useRef } from "react";
import styles from "./Slider.module.css";
import next from "next";

interface SliderProps {
    items: { url: string; type: string }[];
  }

export default function Slider({ items }: SliderProps) {
    const [index, setIndex] = useState(0);

    const startX = useRef(0);
    const endX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        endX.current = e.touches[0].clientX;
    }

    const next = () => {
        setIndex((prev) => (prev + 1) % items.length);
      };
    
      const prev = () => {
        setIndex((prev) => (prev - 1 + items.length) % items.length);
      };

    const handleTouchEnd = () => {
        const diff = startX.current - endX.current;

        if (diff > 50) {
        next();
        } else if (diff < -50) {
        prev();
        }
    };

    return (
        <div 
      className={styles.slider}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {items.length > 1 && (
        <button className={styles.navLeft} onClick={prev}>‹</button>
      )}

      <div className={styles.mediaContainer}>
        {items[index].type === "video" ? (
          <video src={items[index].url} controls className={styles.media} />
        ) : (
          <img src={items[index].url} alt="" className={styles.media} />
        )}
      </div>

      {items.length > 1 && (
        <button className={styles.navRight} onClick={next}>›</button>
      )}

      <div className={styles.dots}>
        {items.map((_, i) => (
          <div
            key={i}
            className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
          />
        ))}
      </div>
    </div>
    )

};