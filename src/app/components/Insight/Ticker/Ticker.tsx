"use client";

import { useState, useEffect } from "react";
import styles from './Ticker.module.css';

const tickers = [
    "Today is a good day to grow ✨",
    "You're 1 step away from progress 🚀",
    "Small steps make big changes 🌱",
    "Consistency is the key 🔑",
    "Believe in yourself 💙",
    "Every day is a fresh start 🌞",
    "You’re becoming the best version of yourself 💪",
    "Keep moving forward ➡️",
    "Great things take time ⏳",
    "Your effort today shapes tomorrow ⭐",
    "Progress over perfection 🌿",
    "One habit at a time 🧩",
    "You got this 🙌",
    "Dream big, start small ✨",
  ];
  

  export default function Ticker() {
    const [index, setIndex] = useState(0);
  
    const handleCycle = () => {
      setIndex((prev) => (prev + 1) % tickers.length);
    };
  
    return (
      <div className={styles.tickerWrapper}>
        <div
          className={styles.tickerContent}
          onAnimationIteration={handleCycle}  
        >
          <span className={styles.item}>{tickers[index]}</span>
        </div>
      </div>
    );
  }