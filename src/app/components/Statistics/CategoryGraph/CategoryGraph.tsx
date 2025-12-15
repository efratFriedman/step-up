"use client";

import { useEffect, useState } from "react";
import { useStatisticsStore } from "@/app/store/useStatisticsStore";
import RangeSelector from "../RangeSelector/RangeSelector";
import styles from "./CategoryGraph.module.css";
import Loader from "../../Loader/Loader";

export default function CategoryGraph() {
    const [range, setRange] = useState<7 | 30 | 365>(7);

    const category7 = useStatisticsStore(s => s.category7);
    const category30 = useStatisticsStore(s => s.category30);
    const category365 = useStatisticsStore(s => s.category365);

    const loading7 = useStatisticsStore(s => s.loading7);
    const loading30 = useStatisticsStore(s => s.loading30);
    const loading365 = useStatisticsStore(s => s.loading365);

    const fetchStatisticsFor = useStatisticsStore(s => s.fetchStatisticsFor);

    const loading =
        range === 7 ? loading7 :
            range === 30 ? loading30 :
                loading365;

    const categoryStats =
        range === 7 ? category7 :
            range === 30 ? category30 :
                category365;

    useEffect(() => {
        fetchStatisticsFor(range);
    }, [range]);

    useEffect(() => {
        if (categoryStats.length === 0) {
            fetchStatisticsFor(range);
        }
    }, [categoryStats, range]);

    return (
        <div className={styles.container}>

            <div className={styles.selectorWrapper}>
                <RangeSelector
                    value={range}
                    onChange={setRange}
                    options={[
                        { value: 7, label: "Weekly" },
                        { value: 30, label: "Monthly" },
                        { value: 365, label: "Yearly" },
                    ]}
                />
            </div>

            {loading ? (
                <div className={styles.loaderWrapper}>
                    <Loader />
                </div>
            ) : (
                <div className={styles.statsContainer}>
                    {categoryStats
                        ?.filter(cat => cat.percent > 0)
                        .map((cat, index) => (
                            <div
                                key={cat.categoryId}
                                className={styles.statItem}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={styles.statHeader}>
                                    <span className={styles.categoryName}>{cat.name}</span>
                                    <span className={styles.percentage}>{cat.percent}%</span>
                                </div>

                                <div className={styles.barBackground}>
                                    <div
                                        className={styles.barFill}
                                        style={{
                                            width: `${cat.percent}%`,
                                            backgroundColor: cat.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
