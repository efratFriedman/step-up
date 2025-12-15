"use client";

import { useState, useEffect } from "react";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import RangeSelector from "../RangeSelector/RangeSelector";
import WaveProgressChart from "../WaveProgressChart/WaveProgressChart";
import Loader from "../../Loader/Loader";
import styles from '@/app/components/Statistics/WeeklyGraph/WeeklyGraph.module.css'

export default function WeeklyGraph() {
    const [range, setRange] = useState<7 | 30>(7);

    const stats7 = useStatisticsStore(s => s.stats7);
    const stats30 = useStatisticsStore(s => s.stats30);

    const loading7 = useStatisticsStore(s => s.loading7);
    const loading30 = useStatisticsStore(s => s.loading30);

    const fetchStatisticsFor = useStatisticsStore(s => s.fetchStatisticsFor);

    useEffect(() => {
        fetchStatisticsFor(range);
    }, [range]);

    const stats = range === 7 ? stats7 : stats30;
    const loading = range === 7 ? loading7 : loading30;

    useEffect(() => {
        if (stats.length === 0) {
            fetchStatisticsFor(range);
        }
    }, [stats, range]);

    return (
        <div style={{ marginBottom: "1.5rem", padding: "0 8px" }}>
            <div className={styles.selectorWrapper}>
                <RangeSelector
                    value={range}
                    onChange={setRange}
                    options={[
                        { value: 7, label: "Weekly" },
                        { value: 30, label: "Monthly" },
                    ]}
                />
            </div>

            {loading ? <Loader /> : <WaveProgressChart data={stats} />}
        </div>
    );
}
