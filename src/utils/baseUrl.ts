export function getBaseUrl() {
    if (typeof window !== "undefined") return "";
    return process.env.NEXT_PUBLIC_SITE_URL
     || "http://localhost:3000";
  }