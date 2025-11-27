"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/services/client/postService";
import PostItem from "../PostItem/PostItem";
import AddPost from "../AddPost/AddPost"; 
import styles from "./PostList.module.css";

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPost, setShowAddPost] = useState(false); 

  useEffect(() => {
    async function load() {
      try {
        const { posts } = await getAllPosts();
        setPosts(posts);
      } catch (error) {
        console.error("Failed to load posts:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleShowAddPost = () => {
    setShowAddPost(true);
  };

  if (loading) {
    return <div className={styles.loading}> wait...</div>;
  }

  if (showAddPost) {
    return <AddPost />;
  }

  return (
    <div className={styles.postList}>
      <button onClick={handleShowAddPost} className={styles.addPostButton}>
        Add New Post
      </button>

      {posts.length === 0 ? (
        <p className={styles.noPosts}>no posts</p>
      ) : (
        posts.map((post) => <PostItem key={post._id} post={post} />)
      )}
    </div>
  );
}
