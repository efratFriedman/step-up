"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import styles from "./WaveProgressChart.module.css";

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipDate}>{label}</p>
        <p className={styles.tooltipValue}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function WaveProgressChart({ data }: { data: any[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className={styles.noData}>
        <p>No data available</p>
      </div>
    );
  }

  const margin = isMobile
    ? { top: 12, right: 10, left: 5, bottom: 10 }
    : { top: 20, right: 25, left: 0, bottom: 10 };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={margin}>
          <defs>
            <linearGradient id="stepupArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e72ac" stopOpacity={0.45} />
              <stop offset="75%" stopColor="#2e72ac" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#2e72ac" stopOpacity={0.05} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3" opacity={0.15} vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e7eb" }}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={isMobile ? 20 : 40}
          />

          <YAxis hide />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="percent"
            stroke="#2e72ac"
            strokeWidth={isMobile ? 2 : 3}
            fill="url(#stepupArea)"
            dot={false}        
            activeDot={false}  
            animationDuration={800}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
