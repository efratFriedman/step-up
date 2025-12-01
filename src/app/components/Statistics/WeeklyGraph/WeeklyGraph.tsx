"use client";

import { useState, useEffect } from "react";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import RangeSelector from "../RangeSelector/RangeSelector";

export default function WeeklyGraph() {
    const [range, setRange] = useState<7 | 30>(7);

    // מושכים רק את מה שצריך → כדי למנוע רינדורים מיותרים
    const stats7 = useStatisticsStore(s => s.stats7);
    const stats30 = useStatisticsStore(s => s.stats30);

    const loading7 = useStatisticsStore(s => s.loading7);
    const loading30 = useStatisticsStore(s => s.loading30);

    const fetchStatisticsFor = useStatisticsStore(s => s.fetchStatisticsFor);

    useEffect(() => {
        fetchStatisticsFor(range);
    }, [range, fetchStatisticsFor]);

    // בחירת דאטה
    const stats = range === 7 ? stats7 : stats30;

    // בחירת לודינג נכון
    const loading = range === 7 ? loading7 : loading30;

    return (
        <div style={{ marginBottom: "2rem" }}>
            <RangeSelector
                value={range}
                onChange={setRange}
                options={[
                    { value: 7, label: "Weekly" },
                    { value: 30, label: "Monthly" },
                ]}
            />

            <h3>{range === 7 ? "Weekly Trend" : "Monthly Trend"}</h3>

            {loading ? (
                <p>Loading…</p>
            ) : (
                <p>Graph goes here…</p>  // תחליפי בגרף האמיתי
            )}
        </div>
    );
}
