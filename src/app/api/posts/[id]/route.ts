import { dbConnect } from "@/lib/DB";
import { authenticate } from "@/lib/server/authMiddleware";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: any) {
  try {
    await dbConnect();
    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { content, media } = body;

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (post.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Validate content
    if (content !== undefined && content.trim() === "") {
      return NextResponse.json(
        { message: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // Update fields
    if (content !== undefined) post.content = content;
    if (media !== undefined) post.media = media;

    await post.save();

    return NextResponse.json({ post });

  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: any) {
    try {
        await dbConnect();
        const user = await authenticate(req);
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const post = await Post.findById(id);

        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (post.userId.toString() !== user._id.toString()) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await Post.findByIdAndDelete(id);
        return NextResponse.json({ message: "Post deleted" });

    } catch (err: any) {
        return NextResponse.json(
            { message: err.message || "Failed to delete post" },
            { status: 500 }
        );
    }
}