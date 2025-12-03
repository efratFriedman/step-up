import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Post from "@/models/Post";
import { authenticate } from "@/lib/server/authMiddleware";
import { Types } from "mongoose";

export async function POST(
    req: Request,
    context: { params: { id: string } | Promise<{ id: string }> }
  ) {
        await dbConnect();
    
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" },
         { status: 401 });
    }

    const params = await context.params;  
    const postId = params.id;
    console.log("Post ID from params:", postId);

  const post = await Post.findById(postId);
  console.log("Post found:", post);

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (post.userId.toString() === userId.toString()) {
    return NextResponse.json(
        { message: "Cannot like your own post" }, { status: 400 });
  }

    const alreadyLiked = post.likedBy?.some((id: Types.ObjectId) => 
    id.toString() === userId.toString());
    
    if (alreadyLiked) {
        post.likedBy = post.likedBy.filter((id: Types.ObjectId) => 
        id.toString() !== userId.toString());
    } else {
        post.likedBy = post.likedBy || [];
        post.likedBy.push(userId);
      }

      post.likesCount = post.likedBy.length;
      await post.save();
    
      return NextResponse.json({
        likesCount: post.likesCount,
        liked: !alreadyLiked,
      });
}