import Post from "@/models/Post";
import { dbConnect } from "@/lib/DB";
import { IPost } from "@/interfaces/IPost";

export async function getPostById(id: string) {
  await dbConnect();

  if (!/^[0-9a-fA-F]{24}$/.test(id)) return null;

  const post = await Post.findById(id)
    .populate("userId") 
    .lean() as IPost | null | undefined;

  if (!post || !post.userId) return null;

  return JSON.parse(JSON.stringify(post));
}
