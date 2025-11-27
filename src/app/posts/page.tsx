"use client";

import AddPost from "@/app/components/Post/AddPost/AddPost";
import PostList from "@/app/components/Post/PostList/PostList";
import styles from "./page.module.css";

export default function PostsPage() {
  return (
    <div className={styles.page}>
      <PostList />
      <AddPost />
    </div>
  );
}
