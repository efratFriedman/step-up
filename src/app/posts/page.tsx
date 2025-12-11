"use client";

import PostList from "@/app/components/Post/PostList/PostList";
import AddPost from "@/app/components/Post/AddPost/AddPost";
import { useModalPostStore } from "@/app/store/usePostModelStore";

export default function PostsPage() {
  const closePostModal = useModalPostStore((s) => s.closePostModal);
  return (
    <>
      <PostList />
      <AddPost onClose={closePostModal}  />
    </>

  )

}
