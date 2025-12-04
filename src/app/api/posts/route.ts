import { NextResponse } from "next/server";
import Post from "@/models/Post";
import {dbConnect} from "@/lib/DB";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(request: Request) {
    try {
      await dbConnect();

      const userId = await authenticate(request);
      const { searchParams } = new URL(request.url);
      const skip = Number(searchParams.get("skip") || 0);
      const limit = Number(searchParams.get("limit") || 3);
  
      const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name profileImg");

     const postsWithLikeStatus = posts.map((post) => {
      const postObj = post.toObject();
      const userIdString = userId?._id ? userId._id.toString() : userId?.toString();
      
      const isLikedByCurrentUser = userIdString && postObj.likedBy?.some(
        (id: any) => id.toString() === userIdString
      );
        return {
          ...postObj,
          currentUserId: userId?.toString() || null,
          isLikedByCurrentUser: isLikedByCurrentUser || false
        };
      });

      const total = await Post.countDocuments();
  
      return NextResponse.json({
        posts: postsWithLikeStatus,
        hasMore: skip + limit < total
      });
    } catch (err: any) {
      return NextResponse.json(
        { message: err.message || "Failed to fetch posts" }, 
        { status: 500 });
    }
  }
  
  
  export async function POST(req: Request) {
    try {
      await dbConnect();
      const body = await req.json();
      console.log("BODY RECEIVED:", body);
  
      const { userId, title, content, media } = body;
  
      if (!userId || !content) {
        console.log("Missing userId or content!");
        return NextResponse.json({ message: "Missing userId or content" }, { status: 400 });
      }
  
      const newPost = await Post.create({
        userId,
        title,
        content,
        media: media || [],
      });
      
      console.log("POST CREATED:", newPost);
  
      return NextResponse.json({ post: newPost });
    } catch (err: any) {
      console.error("POST ERROR:", err);
      return NextResponse.json({ message: err.message || "Something went wrong" }, { status: 500 });
    }
  }
  