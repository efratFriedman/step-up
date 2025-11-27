"use client";

import { useState } from "react";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import PostMedia from "../PostMedia/PostMedia";
import { useUserStore } from "@/app/store/useUserStore";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const user = useUserStore((state) => state.user);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to post");

    const mediaUrls = await Promise.all(
        files.map(async (file) => {
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

    const data = await res.json();
    console.log("Post added:", data.post);

    setContent("");
    setFiles([]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="כתוב משהו..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      
      <input 
        type="file" 
        multiple 
        accept="image/*,video/*" 
        onChange={handleFiles} 
      />

      <PostMedia files={files} />

      <button type="submit">Post</button>
    </form>
  );
}
