import React from "react";
import styles from "./TipCard.module.css";
import { IQuote } from "@/interfaces/IQuote";

interface TipCardProps {
    quote: IQuote;
  }

  export default function TipCard({ quote }: TipCardProps) {
    return (
        <div className={styles.card}>
        <p className={styles.tipHeader}>Daily inspiration point💡:</p>
        <p className={styles.content}>"{quote.content}"</p>
        <p className={styles.author}>— {quote.author}</p>
      </div>
    );
  }
  