"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import { useUserStore } from "@/app/store/useUserStore";
import { addPost } from "@/services/client/postService";
import PostMedia from "../PostMedia/PostMedia";
import styles from "./AddPost.module.css";

interface AddPostProps {
    onSuccess?: () => void;
    onClose?: () => void;
  }

export default function AddPost({ onSuccess, onClose }: AddPostProps) {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = useUserStore((state) => state.user);
    const router = useRouter();

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
          const mediaUrls = await Promise.all(
            files.map(async (file) => {
              if (file.size > 20 * 1024 * 1024) throw new Error(`File ${file.name} too big.`);
              const url = await uploadImageToCloudinary(file);
              return {
                url,
                type: file.type.startsWith("video") ? "video" : "image",
              };
            })
          );

          const data = await addPost({
            userId: user?.id,
            content,
            media: mediaUrls,
          });
    
          setContent("");
          setFiles([]);
          alert("Post added successfully");
    
          onSuccess?.(); 
    
        } catch (err) {
          console.error(err);
          setError((err as Error).message || "Error adding post");
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <div className={styles.addPostModal}>
            <form onSubmit={handleSubmit} className={styles.addPostForm}>
                <button type="button" className={styles.closeButton} onClick={onClose}>×</button>
                
                {error && <p className={styles.errorMessage}>❌ {error}</p>}
                <textarea
                    placeholder="add comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={styles.contentTextArea}
                    disabled={isLoading}
                />

                <div className={styles.actionsContainer}>
                    <label htmlFor="file-upload" className={styles.fileInputLabel}>
                        <span className={styles.fileInputIcon}>🖼️</span>
                        add image/video
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
                    disabled={isLoading || (content.trim() === "" && files.length === 0)}
                >
                    {isLoading ? "uplouding...." : "uploud Post"}
                </button>
            </form>
        </div>
    );
}