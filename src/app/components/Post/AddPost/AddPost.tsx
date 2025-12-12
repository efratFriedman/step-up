"use client";

import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import { useUserStore } from "@/app/store/useUserStore";
import { useModalPostStore } from "@/app/store/usePostModelStore";
import { addPost } from "@/services/client/postService";
import PostMedia from "../PostMedia/PostMedia";
import styles from "./AddPost.module.css";
import { usePostStore } from "@/app/store/usePostStore";
import { filterPostAI, generatePostAI } from "@/services/client/aiPostService";

interface AddPostProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AddPost({ onClose }: AddPostProps) {
  const isPostModalOpen = useModalPostStore((s) => s.isPostModalOpen);
  const closePostModal = useModalPostStore((s) => s.closePostModal);
  const user = useUserStore((s) => s.user);

  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // ⭐ האם הפוסט כבר אושר בסינון AI?
  const [wasApprovedByAI, setWasApprovedByAI] = useState(false);

  const [show, setShow] = useState(false);
  const setHasMore = usePostStore((s) => s.setHasMore);

  useEffect(() => {
    if (isPostModalOpen) setShow(true);
    else {
      const timeout = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isPostModalOpen]);

  if (!isPostModalOpen && !show) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const uploadMedia = async () => {
    return Promise.all(
      files.map(async (file) => {
        if (file.size > 20 * 1024 * 1024)
          throw new Error(`File ${file.name} too big.`);

        const url = await uploadImageToCloudinary(file);

        return {
          url,
          type: file.type.startsWith("video") ? "video" : "image",
        };
      })
    );
  };

  const reset = () => {
    setContent("");
    setFiles([]);
    setAiSuggestion(null);
    setGeneratedPost(null);
    setWasApprovedByAI(false);
    setHasMore(true);
    (onClose || closePostModal)();
  };

  // ⭐ Generate inspirational post
  const handleGeneratePost = async () => {
    if (!content.trim()) {
      setError("Write a short idea first ✨");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const data = await generatePostAI(content);
      if (data.post) setGeneratedPost(data.post);
      else setError("Failed to generate post.");
    } catch {
      setError("Failed to generate post.");
    } finally {
      setIsGenerating(false);
    }
  };

  // ⭐ MAIN SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setError(null);
    setIsLoading(true);

    try {
      // ❌ מניעת פוסט ריק
      if (!content.trim() && files.length === 0) {
        setError("Please add text or upload media.");
        setIsLoading(false);
        return;
      }

      // ⭐ CASE 1 — כבר עבר סינון AI → מעלים מיד
      if (wasApprovedByAI) {
        const mediaUrls = await uploadMedia();
        await addPost({ userId: user.id, content, media: mediaUrls });
        reset();
        return;
      }

      // ⭐ CASE 2 — סינון AI ראשון
      const aiData = await filterPostAI(content, files.length > 0);

      if (!aiData.allowed) {
        setError("This post is not suitable for StepUp.");
        setIsLoading(false);
        return;
      }

      // ⭐ הצעת שכתוב
      if (aiData.rewrite) {
        setAiSuggestion(aiData.rewrite);
        setIsLoading(false);
        return;
      }

      // ⭐ הפוסט מאושר → מעלים
      const mediaUrls = await uploadMedia();
      await addPost({ userId: user.id, content, media: mediaUrls });

      setWasApprovedByAI(true);
      reset();
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Error adding post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.addPostModal} ${isPostModalOpen ? styles.show : styles.hide}`}>
      <div className={`${styles.modal} ${isPostModalOpen ? styles.slideIn : styles.slideOut}`}>

        {/* ⭐ GENERATED POST */}
        {generatedPost && (
          <div className={styles.aiSuggestionBox}>
            <h4>✨ Suggested post:</h4>
            <p>{generatedPost}</p>

            <button
              className={styles.useSuggestionButton}
              onClick={() => {
                setContent(generatedPost);
                setGeneratedPost(null);
                setWasApprovedByAI(true);
              }}
            >
              Use this post
            </button>

            <button className={styles.rejectSuggestionButton} onClick={() => setGeneratedPost(null)}>
              Cancel
            </button>
          </div>
        )}

        {/* ⭐ FILTER REWRITE */}
        {aiSuggestion && (
          <div className={styles.aiSuggestionBox}>
            <h4>✨ Improved wording:</h4>
            <p>{aiSuggestion}</p>

            <button
              className={styles.useSuggestionButton}
              onClick={() => {
                setContent(aiSuggestion!);
                setAiSuggestion(null);
                setWasApprovedByAI(true);
              }}
            >
              Use this wording
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.addPostForm}>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose || closePostModal}
          >
            ×
          </button>

          {error && <p className={styles.errorMessage}>❌ {error}</p>}

          <textarea
            placeholder="Add comment..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setWasApprovedByAI(false); // אם המשתמש שינה — חייב סינון מחדש
            }}
            className={styles.contentTextArea}
            disabled={isLoading}
          />

          <button
            type="button"
            className={styles.generateButton}
            onClick={handleGeneratePost}
            disabled={!content.trim()}
          >
            {isGenerating ? "Generating..." : "✨ Generate Post"}
          </button>

          <div className={styles.actionsContainer}>
            <label htmlFor="file-upload" className={styles.fileInputLabel}>
              <span className={styles.fileInputIcon}>🖼️</span>
              Add image/video
            </label>

            <input
              id="file-upload"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFiles}
              className={styles.fileInput}
            />

            <PostMedia files={files} />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading || (!content.trim() && files.length === 0)}
          >
            {isLoading ? "Uploading..." : "Upload Post"}
          </button>
        </form>
      </div>
    </div>
  );
}
