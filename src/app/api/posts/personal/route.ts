import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { dbConnect } from "@/lib/DB";
import { authenticate } from "@/lib/server/authMiddleware";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const user = await authenticate(req);

        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const posts = await Post.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .populate("userId", "name profileImg");

        const postsWithLikeStatus = posts.map((post) => {
            const obj = post.toObject();
            const isLiked = obj.likedBy?.some(
                (id: any) => id.toString() === user._id.toString()
            );

            return {
                ...obj,
                currentUserId: user._id.toString(),
                isLikedByCurrentUser: isLiked || false,
            };
        });

        return NextResponse.json({ posts: postsWithLikeStatus });

    } catch (err: any) {
        return NextResponse.json(
            { message: err.message || "Failed to load user's posts" },
            { status: 500 }
        );
    }
}
