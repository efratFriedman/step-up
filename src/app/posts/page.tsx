"use client";

import { useState } from "react";
import PostList from "@/app/components/Post/PostList/PostList";
import AddPost from "@/app/components/Post/AddPost/AddPost";
import { useModalPostStore } from "@/app/store/usePostModelStore";

export default function PostsPage() {
  const closePostModal = useModalPostStore((s) => s.closePostModal);
  // const [refreshTrigger, setRefreshTrigger] = useState(0);

  // const handlePostSuccess = () => {
  //   setRefreshTrigger((prev) => prev + 1);
  // };

  return (
    <>
      <PostList />
      <AddPost onClose={closePostModal}  />
    </>

  )

}
