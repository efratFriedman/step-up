"use client";

import { useEffect, useState } from "react";
import { useInsightStore } from "@/app/store/useInsightStore";
import GrowthTree from "../components/Insight/Blokes/GrowthTree/GrowthTree";
// import DayStreakCard from "../components/Insight/Blokes/DayStreak/DayStreak";
import AchievementsCard from "../components/Insight/Blokes/Achievements/Achievements";
import CompletedCard from "../components/Insight/Blokes/Completed/Completed";
import TipCard from "../components/Insight/TipCard/TipCard";
import { IQuote } from "@/interfaces/IQuote";
import { fetchRandomQuote } from "@/services/client/quoteServise";
import styles from "./page.module.css";
import InsightMessage from "../components/Insight/InsightCard/InsightMessage";
import Ticker from "../components/Insight/Ticker/Ticker";
import Loader from "../components/Loader/Loader";
import StrongestHabit from "../components/Insight/Blokes/StrongestHabit/StrongestHabit";

export default function InsightsPage() {
  const { strongestHabit, completed, completedThisWeek, fetchInsights } = useInsightStore();

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
    <div className={styles.pageContainer}>
    <div className={styles.container}>
      <InsightMessage/>
    <div className={styles.grid}>
      {/* <DayStreakCard value={dayStreak} /> */}
      <GrowthTree completedCount={completedThisWeek} />
      <StrongestHabit habit={strongestHabit} />
      {/* <AchievementsCard value={achievements} /> */}
      <CompletedCard value={completed} />
    </div>

    <div className={styles.tipSection}>
      {loadingQuote && <Loader />}
      {quoteError && <p>{quoteError}</p>}
      {quote && <TipCard quote={quote} />}
    </div>
    <Ticker/>
  </div>
  </div>
  );
}

