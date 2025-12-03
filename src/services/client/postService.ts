  export async function getAllPosts() {
    const res = await fetch(`/api/posts`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  }
  
  export async function addPost(postData: any) {
    const res = await fetch(`/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(postData),
    });
  
    if (!res.ok) throw new Error("Failed to add post");
    return res.json();
  }

  export async function getPostsPaginated(skip: number, limit: number) {
    const res = await fetch(`/api/posts?skip=${skip}&limit=${limit}`,{
     credentials: "include",
     });
    if (!res.ok) throw new Error("Failed to fetch paginated posts");
    return res.json();
  }

  export async function toggleLike(postId: string) {
    const res = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      credentials: "include",
    });
  
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to toggle like on post");
    }
  
    return res.json();
  }
