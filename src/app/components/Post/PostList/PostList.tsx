"use client";

import { useEffect, useState, useRef  } from "react";
import { getPostsPaginated  } from "@/services/client/postService";
import PostItem from "../PostItem/PostItem";
import Loader from "../../Loader/Loader"; 
import styles from "./PostList.module.css";

interface PostListProps {
  refreshTrigger?: number; 
}


export default function PostList({ refreshTrigger }: PostListProps) {
  const LIMIT = 3;

  const [posts, setPosts] = useState<any[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

   
  useEffect(() => {
    setPosts([]);
    setSkip(0);
    setHasMore(true);
    loadMorePosts();
  }, [refreshTrigger]);

  const loadMorePosts = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const data  = await getPostsPaginated(skip, LIMIT);

      setPosts((prev) => {
        const merged = [...prev, ...data.posts];
        const unique = Array.from(
          new Map(merged.map((post) => [post._id, post])).values()
        );

        return unique;
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
    if(!bottomRef.current) return;

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
  }, [hasMore, loading, posts]);

  
  return (
    <div className={styles.postList}>
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
      <div ref={bottomRef} style={{ height: "30px" }}></div>
      {loading && <Loader />}
    </div>
  );
}
