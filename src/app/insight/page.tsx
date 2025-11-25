"use client";

import { useEffect, useState } from "react";
import { useInsightStore } from "@/app/store/useInsightStore";
import DayStreakCard from "../components/Insight/Blokes/DayStreak/DayStreak";
import AchievementsCard from "../components/Insight/Blokes/Achievements/Achievements";
import CompletedCard from "../components/Insight/Blokes/Completed/Completed";
import TipCard from "../components/Insight/TipCard/TipCard";
import { IQuote } from "@/interfaces/IQuote";
import { fetchRandomQuote } from "@/services/client/quoteServise";
import styles from "./page.module.css";
import InsightMessage from "../components/Insight/InsightCard/InsightMessage";
import Ticker from "../components/Insight/Ticker/Ticker";

export default function InsightsPage() {
  const { dayStreak, achievements, completed, fetchInsights } = useInsightStore();

  const [quote, setQuote] = useState<IQuote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();

    fetchRandomQuote()
      .then(q => {
        setQuote(q);
        setLoadingQuote(false);
      })
      .catch(() => {
        setQuoteError("Could not load tip");
        setLoadingQuote(false);
      });
  }, []);


  return (
    <div className={styles.container}>
      <InsightMessage/>
    <div className={styles.grid}>
      <DayStreakCard value={dayStreak} />
      <AchievementsCard value={achievements} />
      <CompletedCard value={completed} />
    </div>

    <div className={styles.tipSection}>
      {loadingQuote && <p>Loading tip...</p>}
      {quoteError && <p>{quoteError}</p>}
      {quote && <TipCard quote={quote} />}
    </div>
    <Ticker/>
  </div>
  );
}

