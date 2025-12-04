import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Post from "@/models/Post";
import { authenticate } from "@/lib/server/authMiddleware";
import { Types } from "mongoose";

interface Params {
  id: string;
}

export async function POST(
  req: Request,
  context: { params: Params | Promise<Params> }
  ) {
    try {
        await dbConnect();
    
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" },
         { status: 401 });
    }

    const params = await context.params as Params;
    const postId: string = params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.userId.toString() === userId.toString()) {
      return NextResponse.json(
          { message: "Cannot like your own post" }, { status: 400 });
    }

    post.likedBy = post.likedBy || [];
  
    const alreadyLiked = post.likedBy.some(
      (id: Types.ObjectId) => id.toString() === userId._id.toString()
    );

    console.log("Already liked:", alreadyLiked);
    
      
    if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        (id: Types.ObjectId) => id.toString() !== userId._id.toString()
      );
    } else {
      post.likedBy.push(userId._id);
    }


    post.likesCount = post.likedBy.length;
    await post.save();

    return NextResponse.json({
      likesCount: post.likesCount,
      liked: !alreadyLiked, 
    });
  } catch (err: any) {
    console.error("Error toggling like:", err);
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}