"use client";

import { useState } from "react";
import styles from "./AddPost.module.css";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import PostMedia from "../PostMedia/PostMedia";
import { useUserStore } from "@/app/store/useUserStore";

export default function AddPost() {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const user = useUserStore((state) => state.user);

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user) {
            setError("עליך להיות מחובר כדי לפרסם.");
            return;
        }

        if (content.trim() === "" && files.length === 0) {
            setError("אנא הוסף תוכן או מדיה לפוסט.");
            return;
        }

        setIsLoading(true);

        try {
            const mediaUrls = await Promise.all(
                files.map(async (file) => {
                    if (file.size > 20 * 1024 * 1024) { 
                        throw new Error(`הקובץ ${file.name} גדול מדי.`);
                    }

                    const url = await uploadImageToCloudinary(file);

                    return {
                        url,
                        type: file.type.startsWith("video") ? "video" : "image"
                    };
                })
            );

            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    content,
                    media: mediaUrls,
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "שגיאה בהוספת הפוסט");
            }

            const data = await res.json();
            console.log("Post added:", data.post);

            setContent("");
            setFiles([]);
            alert("הפוסט פורסם בהצלחה!"); 
        } catch (err) {
            console.error("Failed to add post:", err);
            setError((err as Error).message || "אירעה שגיאה בלתי צפויה.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.addPostForm}>
            {error && <p className={styles.errorMessage}>❌ {error}</p>}
            <textarea
                placeholder="כתוב משהו..."
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
                {isLoading ? "saving...." : "save"}
            </button>
        </form>
    );
}