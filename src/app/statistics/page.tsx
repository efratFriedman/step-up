"use client";

import CategoryGraph from "../components/Statistics/CategoryGraph/CategoryGraph";
import HeatmapMonth from "../components/Statistics/Heatmap/Heatmap";
import WeeklyGraph from "../components/Statistics/WeeklyGraph/WeeklyGraph";



export default function StatisticsPage() {
  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }
      }
    >

      < WeeklyGraph />

      < CategoryGraph />

      {/* < TinyStats /> */}
      <HeatmapMonth />

    </div>
  );
}
