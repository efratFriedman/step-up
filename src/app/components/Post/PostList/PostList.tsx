"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/services/client/postService";
import PostItem from "../PostItem/PostItem";

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
        const { posts } = await getAllPosts();
        setPosts(posts);        
        
    }
    load();
  }, []);

  return (
    <div>
      <h2>All Posts</h2>
      {posts.map((post) => (
        <PostItem key={post._id} post={post} />
      ))}
    </div>
  );
}
