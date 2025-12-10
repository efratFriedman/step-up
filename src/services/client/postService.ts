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

// export async function getPostsPaginated(skip: number, limit: number) {
//   const res = await fetch(`/api/posts?skip=${skip}&limit=${limit}`, {
//     credentials: "include",
//   });
//   if (!res.ok) throw new Error("Failed to fetch paginated posts");
//   return res.json();
// }

export async function getPostsPaginated(skip: number, limit: number) {
  const res = await fetch(`/api/posts?&limit=${limit}`, {
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

export async function updatePost(postId: string, data: any) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update post");
  }

  return res.json();
}

export async function deletePost(postId: string) {
  const res = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to delete post");
  }

  return true;
}

export async function getPersonalPosts() {
  const res = await fetch(`/api/posts/personal`, {
    credentials: "include"
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch posts");
  }

  return res.json();
}