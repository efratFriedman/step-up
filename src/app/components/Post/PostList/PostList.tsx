"use client";

import { useEffect, useState, useRef } from "react";
import { usePostStore } from "@/app/store/usePostStore";
import { useUserStore } from "@/app/store/useUserStore";
import { getPostsPaginated } from "@/services/client/postService";
import { getPusherClient } from "@/lib/pusher-frontend";
import { IPost } from "@/interfaces/IPost";
import PostItem from "../PostItem/PostItem";
import Loader from "../../Loader/Loader";
import styles from "./PostList.module.css";

interface PostListProps {
  refreshTrigger?: number;
}

export default function PostList({ }: PostListProps) {
  const LIMIT = 9;
  const posts = usePostStore((s) => s.posts);
  const setPosts = usePostStore((s) => s.setPosts);
  const initializePostChannel = usePostStore((s) => s.initializePusherChannel);
  const userId = useUserStore((s) => s.user?.id);
  const hasMore = usePostStore((s) => s.hasMore);
  const setHasMore = usePostStore((s) => s.setHasMore);

  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    setSkip(0);
    setHasMore(true);
    loadMorePosts();
  }, [setHasMore]);

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const data = await getPostsPaginated(skip, LIMIT);
      const merged = [...posts, ...data.posts];
      const unique = Array.from(new Map(merged.map((p) => [p._id, p])).values());

      setPosts(unique);

      const pusher = getPusherClient(userId);

      data.posts.forEach((post: IPost) => {
        initializePostChannel(String(post._id), pusher);
      });

      setSkip((prev) => prev + LIMIT);
      setHasMore(data.hasMore);

    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!bottomRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);


  return (
    <div className={styles.postList}>
      {posts.map((post) => (
        <PostItem key={String(post._id)} post={post} />
      ))}
      <div ref={bottomRef} style={{ height: "30px" }}></div>
      {loading && <Loader />}
    </div>
  );
}
