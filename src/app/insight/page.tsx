"use client";

import { useEffect, useState } from "react";
import { useInsightStore } from "@/app/store/useInsightStore";
import GrowthTree from "../components/Insight/Blokes/GrowthTree/GrowthTree";
import FortuneFunChallenge from "../components/Insight/Blokes/FortuneFunChallenge/FortuneFunChallenge";
import CompletedCard from "../components/Insight/Blokes/Completed/Completed";
import TipCard from "../components/Insight/TipCard/TipCard";
import { IQuote } from "@/interfaces/IQuote";
import { fetchRandomQuote } from "@/services/client/quoteServise";
import styles from "./page.module.css";
import InsightMessage from "../components/Insight/InsightCard/InsightMessage";
import Ticker from "../components/Insight/Ticker/Ticker";
import Loader from "../components/Loader/Loader";

export default function InsightsPage() {
  const { completed, completedThisWeek, fetchInsights } = useInsightStore();

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
      <GrowthTree completedCount={completedThisWeek} />
      <FortuneFunChallenge />
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

