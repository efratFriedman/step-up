"use client";

import { useState } from "react";
import { tickers } from "@/utils/tickers";
import styles from './Ticker.module.css';

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