"use client";

import { useEffect } from "react";
import CategoryGraph from "../components/Statistics/CategoryGraph/CategoryGraph";
import HeatmapMonth from "../components/Statistics/Heatmap/Heatmap";
import WeeklyGraph from "../components/Statistics/WeeklyGraph/WeeklyGraph";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";

export default function StatisticsPage() {
  const fetchStatisticsFor = useStatisticsStore(s => s.fetchStatisticsFor);

  // Optional: Pre-fetch initial data on page load
  useEffect(() => {
    fetchStatisticsFor(7); // Load weekly stats initially
    fetchStatisticsFor(365); // Load yearly stats for heatmap
  }, [fetchStatisticsFor]);

  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <WeeklyGraph />
      <CategoryGraph />
      <HeatmapMonth />
    </div>
  );
}
