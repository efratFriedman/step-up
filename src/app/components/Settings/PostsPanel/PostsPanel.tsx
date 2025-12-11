"use client";

import { useEffect, useState } from "react";
import { usePostStore } from "@/app/store/usePostStore";
import { deletePost, getPersonalPosts } from "@/services/client/postService";
import styles from "./PostsPanel.module.css";
import EditPostModal from "../EditPostModal/EditPostModal";

export default function PostsPanel() {
  const { posts, setPosts, removePost } = usePostStore();

  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [postToEdit, setPostToEdit] = useState<any>(null); 
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    (async () => {
      const data = await getPersonalPosts();
      setPosts(data.posts);
    })();
  }, [setPosts]);

  const handleOpenDeleteModal = (post: any) => {
    setPostToDelete(post);
    setConfirmText("");
  };

  const handleOpenEditModal = (post: any) => {
    setPostToEdit(post);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete?._id) return;

    await deletePost(String(postToDelete._id));
    removePost(String(postToDelete._id));

    setPostToDelete(null);
    setConfirmText("");
  };

  const handleCloseDeleteModal = () => {
    setPostToDelete(null);
    setConfirmText("");
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>My Posts</h2>

      {posts.length === 0 && (
        <p className={styles.empty}>You have no posts yet.</p>
      )}

      <div className={styles.list}>
        {posts.map((post) => (
          <div key={String(post._id)} className={styles.card}>
            
            {/* Media preview */}
            {post.media?.length > 0 && (
              <div className={styles.media}>
                <img src={post.media[0].url} alt="" />
              </div>
            )}

            <p className={styles.content}>{post.content}</p>

            {/* ACTION BUTTONS */}
            <div className={styles.actions}>
              {/* <button
                className={styles.editBtn}
                onClick={() => handleOpenEditModal(post)}
              >
                Edit
              </button> */}

              <button
                className={styles.deleteBtn}
                onClick={() => handleOpenDeleteModal(post)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Delete Modal ---------------- */}
      {postToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Delete Post?</h3>

            <p className={styles.modalText}>
              This action cannot be undone.
              <br />
              To confirm, type{" "}
              <strong>{postToDelete.content.slice(0, 8)}</strong>.
            </p>

            <input
              className={styles.modalInput}
              placeholder={`Type "${postToDelete.content.slice(0, 8)}"`}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={handleCloseDeleteModal}>
                Cancel
              </button>

              <button
                className={styles.confirmBtn}
                disabled={confirmText !== postToDelete.content.slice(0, 8)}
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Edit Modal ---------------- */}
      {/* {postToEdit && (
        <EditPostModal 
          post={postToEdit} 
          onClose={() => setPostToEdit(null)} 
        />
      )} */}
    </div>
  );
}
