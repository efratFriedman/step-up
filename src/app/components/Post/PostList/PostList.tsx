"use client";

import { useEffect, useState } from "react";
import { getAllPosts } from "@/services/client/postService";
import PostItem from "../PostItem/PostItem";
import AddPost from "../AddPost/AddPost";
import Loader from "../../Loader/Loader"; 
import styles from "./PostList.module.css";

export default function PostList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPost, setShowAddPost] = useState(false); 
  const [visibleCount, setVisibleCount] = useState(3)

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { posts } = await getAllPosts();
      setPosts(posts);
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleShowAddPost = () => {
    setShowAddPost(true);
  };

  const handleAddPostSuccess = () => {
    setShowAddPost(false); 
    loadPosts(); 
    setVisibleCount(3);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className={styles.postList}>
      <button onClick={handleShowAddPost} className={styles.addPostButton}>
        Add New Post
      </button>

      {posts.length === 0 && !loading && (
        <p className={styles.noPosts}>No posts</p>
      )}

      {posts.slice(0, visibleCount).map((post) => (
        <PostItem key={post._id} post={post} />
      ))}

      {visibleCount < posts.length && (
        <button className={styles.viewMoreButton} onClick={handleViewMore}>
          View More
        </button>
      )}

      {loading && <Loader />}

      {showAddPost && (
        <AddPost
          onSuccess={handleAddPostSuccess}
          onClose={() => setShowAddPost(false)}
        />
      )}
    </div>
  );
}
