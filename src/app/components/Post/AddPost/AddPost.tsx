"use client";

import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import { useUserStore } from "@/app/store/useUserStore";
import { useModalPostStore } from "@/app/store/usePostModelStore";
import { addPost } from "@/services/client/postService";
import PostMedia from "../PostMedia/PostMedia";
import styles from "./AddPost.module.css";
import { usePostStore } from "@/app/store/usePostStore";
import { filterPostAI, generatePostAI } from "@/services/client/habitsService";

interface AddPostProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export default function AddPost({ onClose }: AddPostProps) {
  const isPostModalOpen = useModalPostStore((state) => state.isPostModalOpen);
  const closePostModal = useModalPostStore((state) => state.closePostModal);
  const user = useUserStore((state) => state.user);

  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null); 
  const [generatedPost, setGeneratedPost] = useState<string | null>(null); 
  const [isGenerating, setIsGenerating] = useState(false);

  const [show, setShow] = useState(false);
  const setHasMore = usePostStore((s) => s.setHasMore);

  useEffect(() => {
    if (isPostModalOpen) {
      setShow(true);
    } else {
      const timeout = setTimeout(() => setShow(false), 300); // match CSS transition
      return () => clearTimeout(timeout);
    }
  }, [isPostModalOpen]);

  if (!isPostModalOpen && !show) return null;

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleGeneratePost = async () => {
    if (!content.trim()) {
      setError("Write a short idea first so I can build a post ✨");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const data = await generatePostAI(content);
      if (data.post) {
        setGeneratedPost(data.post);
      } else {
        setError("Failed to generate post.");
      }
    } catch {
      setError("Failed to generate post.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    setError(null);
    setIsLoading(true);

    try {
      if (!aiSuggestion) {

        const mediaUrls = await Promise.all(
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

        await addPost({
          userId: user.id,
          content,
          media: mediaUrls,
        });

        setContent("");
        setFiles([]);
        setGeneratedPost(null);
        setAiSuggestion(null);
        setHasMore(true);

        (onClose || closePostModal)();
        return;
      }

      const aiResponse =await filterPostAI(content, files.length > 0);

      const aiData = await aiResponse.json();

      if (!aiData.allowed) {
        setError("This post is not suitable for StepUp.");
        setIsLoading(false);
        return;
      }

      if (aiData.rewrite) {
        setAiSuggestion(aiData.rewrite);
        setIsLoading(false);
        return;
      }

      const mediaUrls = await Promise.all(
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

      await addPost({
        userId: user.id,
        content: aiData.rewrite || content,
        media: mediaUrls,
      });

      
      setContent("");
      setFiles([]);
      setGeneratedPost(null);
      setAiSuggestion(null);
      setHasMore(true);

      (onClose || closePostModal)();

    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Error adding post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${styles.addPostModal} ${isPostModalOpen ? styles.show : styles.hide}`}
    >
      <div
        className={`${styles.modal} ${
          isPostModalOpen ? styles.slideIn : styles.slideOut
        }`}
      >
        {generatedPost && (
          <div className={styles.aiSuggestionBox}>
            <h4>✨ Suggested post from AI:</h4>
            <p>{generatedPost}</p>
  
            <button
              className={styles.useSuggestionButton}
              onClick={() => {
                setContent(generatedPost);
                setGeneratedPost(null);
              }}
            >
              Use this post
            </button>
  
            <button
              className={styles.rejectSuggestionButton}
              onClick={() => setGeneratedPost(null)}
            >
              Cancel
            </button>
          </div>
        )}
  
        {aiSuggestion && (
          <div className={styles.aiSuggestionBox}>
            <h4>✨ Improved wording the AI suggests:</h4>
            <p>{aiSuggestion}</p>
  
            <button
              className={styles.useSuggestionButton}
              onClick={() => {
                setContent(aiSuggestion);
                setAiSuggestion(null);
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
            onChange={(e) => setContent(e.target.value)}
            className={styles.contentTextArea}
            disabled={isLoading}
          />
  
          <button
            type="button"
            className={styles.generateButton}
            onClick={handleGeneratePost}
            disabled={isGenerating || !content.trim()}
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
              disabled={isLoading}
            />
            <PostMedia files={files} />
          </div>
  
          <button
            type="submit"
            className={styles.submitButton}
            disabled={
              isLoading ||
              !!aiSuggestion ||
              (content.trim() === "" && files.length === 0)
            }
          >
            {isLoading ? "Uploading..." : "Upload Post"}
          </button>
          {aiSuggestion && (
            <p className={styles.disabledMessage}>
              Your post sounds a bit discouraging, so it can’t be published as-is 😊
              You’re welcome to use the improved version suggested by the system,
              or edit your text into something more positive and uplifting.
            </p>
          )}
        </form>
      </div>
    </div>
  );
  
}