import PostItem from "@/app/components/Post/PostItem/PostItem";
import { getPostById } from "@/services/server/postService";
import { notFound } from "next/navigation";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export default async function SinglePostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const postId = resolvedParams?.postId;
  if (!postId) return <div>Invalid post</div>;

  const post = await getPostById(postId);
  
  if (!post) {
    notFound();
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
    <PostItem post={post} />
  </div>
  );
}