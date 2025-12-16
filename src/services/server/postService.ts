// import { getBaseUrl } from "@/lib/baseUrl";

// export async function getPostById(postId: string) {
//     const res = await fetch(`${getBaseUrl()}/api/posts/${postId}`);
//     if (!res.ok) throw new Error("Failed to load post");
//     return res.json();
//   }
// src/services/server/postService.ts
import Post from "@/models/Post";
import { dbConnect } from "@/lib/DB";
import { IPost } from "@/interfaces/IPost";

export async function getPostById(id: string) {
  await dbConnect();

  if (!/^[0-9a-fA-F]{24}$/.test(id)) return null;

  const post = await Post.findById(id)
    .populate("userId") 
    .lean() as IPost | null;

  if (!post || !post.userId) return null;

  return post;
}
