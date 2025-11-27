import { NextResponse } from "next/server";
import Post from "@/models/Post";
import {dbConnect} from "@/lib/DB";

export async function GET() {
    try {
      await dbConnect();
  
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .populate("userId", "name profileImg"); 
  
      return NextResponse.json({ posts });
    } catch (err: any) {
      return NextResponse.json({ message: err.message || "Failed to fetch posts" }, { status: 500 });
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
  