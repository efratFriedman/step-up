import { DailyStat } from "@/utils/statistics";
interface StatisticsResponse {
    range: number;
    stats: DailyStat[];
    categories: any[];
}

export async function getStatistics(range: 7 | 30 | 365): Promise<StatisticsResponse> {
    try {
        const res = await fetch(`/api/statistics?range=${range}`, {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch statistics");
        }
        const data = await res.json();

        return data;
    } catch (error) {
        console.error("Client Statistics Error:", error);
        throw error;
    }
}