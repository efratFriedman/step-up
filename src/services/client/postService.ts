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
