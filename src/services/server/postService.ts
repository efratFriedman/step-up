import { getBaseUrl } from "@/utils/baseUrl";


export const getPostById = async (id: string) => {
  const res = await fetch(
    `${getBaseUrl()}/api/posts/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.post;
};