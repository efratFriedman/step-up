"use client";

import { useState, useEffect } from "react";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import { DailyStat } from "@/utils/statistics";
import RangeSelector from "../RangeSelector/RangeSelector";

export default function WeeklyGraph() {
    const [range, setRange] = useState<7 | 30>(7);

    const { stats7, stats30, fetchStatisticsFor, loading } = useStatisticsStore();


    useEffect(() => {
        fetchStatisticsFor(range);
    }, [range]);
    
    const stats = range === 7 ? stats7 : stats30;


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

            {loading ? <p>Loading…</p> : <p>Graph goes here…</p>}
        </div>
    );
}
