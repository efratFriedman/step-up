export async function filterPostAI(content: string, hasMedia: boolean) {
  const res = await fetch('/api/agent/posts/filter', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, hasMedia }),
  });

  if (!res.ok) {
    throw new Error("AI filter request failed.");
  }

  return res.json();
}
export async function generatePostAI(idea: string) {
  const res = await fetch(`/api/agent/posts/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea }),
  });

  if (!res.ok) {
    throw new Error("AI generate request failed.");
  }

  return res.json();
}