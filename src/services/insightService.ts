export async function getInsights() {
    const res = await fetch("/api/insights", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch insights");
    }
    
    return res.json();
}