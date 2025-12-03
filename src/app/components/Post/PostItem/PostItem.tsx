"use client";

import { useState } from "react";
import { toggleLike } from "@/services/client/postService";
import { IPost } from "@/interfaces/IPost";
import Slider from "../Slider/Slider"; 
import styles from "./PostItem.module.css";
import { Heart } from "lucide-react";

export default function PostItem({ post }: { post: IPost & { userId: { name: string; profileImg?: string } } }) {
  const [likes, setLikes] = useState(post.likesCount);
  const [liked, setLiked] = useState(
    post.likedBy?.some(id => id.toString() === post.currentUserId) 
    || false);

  const onLike = async () => {
    try {
      const res = await toggleLike(post._id.toString());
      setLikes(res.likesCount);
      setLiked(res.liked);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }

  return (
    <div className={styles.postItem}>
      <div className={styles.profile}>
        <img 
          src={post.userId.profileImg || "/default-profile.png"} 
          alt={post.userId.name} 
          className={styles.profileImg} 
        />
        <p className={styles.userName}>{post.userId.name}</p>
      </div>

      <div className={styles.content}>

        {/* תמונות/וידאו */}
        {post.media && post.media.length > 0 && (
          <Slider items={post.media.map((item) => ({
            url: item.url,
            type: item.type,
          }))} />
        )}

        <p className={styles.postText}>{post.content}</p>

        <div className={styles.likeWrapper} onClick={onLike}>
          <Heart 
            fill={liked ? "red" : "transparent"} 
            color={liked ? "red" : "black"}
            className={styles.likeIcon}
          />
          <span className={styles.likesCount}>{likes}</span>
        </div>

      </div>
    </div>
  );
}