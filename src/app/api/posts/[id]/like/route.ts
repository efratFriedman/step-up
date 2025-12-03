import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/DB";
import Post from "@/models/Post";
import { authenticate } from "@/lib/server/authMiddleware";

export async function POST(req: Request, { params }: any){
    await dbConnect();
    
    const userId = await authenticate(req);
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" },
         { status: 401 });
    }

    const post = await Post.findById(params.id);
    if (!post) {
        return NextResponse.json({ message: "Post not found" },
         { status: 404 });
    }

    if(post.userId.toString() === userId){
        return NextResponse.json({ message: "Cannot like your own post" },
         { status: 400 });
    }

    const alreadyLiked = post.likedBy?.includes(userId);

    if(alreadyLiked){
        post.likedBy = post.likedBy.filter((id: any) => id.toString() !== userId);
    } else {
        post.likedBy.push(userId);
    }

    post.likesCount = post.likedBy.length;
    await post.save();
    return NextResponse.json({ 
        likesCount: post.likesCount,
        liked: !alreadyLiked
     });
     
}