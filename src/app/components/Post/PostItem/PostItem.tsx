"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { IPost, IUserPopulated } from "@/interfaces/IPost";
import Slider from "../Slider/Slider";
import styles from "./PostItem.module.css";
import { Heart } from "lucide-react";
import { usePostStore } from "@/app/store/usePostStore";

export default function PostItem({ post }: { post: IPost }) {
  const currentUser = useUserStore((state) => state.user);
  const toggleLike = usePostStore((s) => s.toggleLikeAction);

  const user = post.userId as IUserPopulated;

  const liked = post.isLikedByCurrentUser;
  const likes = post.likesCount;

  const isOwnPost =
    currentUser?.id?.toString() === user._id?.toString();

  const onLike = () => {
    if (!isOwnPost) toggleLike(String(post._id));
  };

  return (
    <div className={styles.postItem}>
      <div className={styles.profile}>
        <img
          src={user.profileImg || "/default-profile.png"}
          alt={user.name}
          className={styles.profileImg}
        />
        <p className={styles.userName}>{user.name}</p>
      </div>

      <div className={styles.content}>
        {post.media?.length > 0 && (
          <Slider
            items={post.media.map((item) => ({
              url: item.url,
              type: item.type,
            }))}
          />
        )}

        <p className={styles.postText}>{post.content}</p>

        <div
          className={styles.likeWrapper}
          onClick={onLike}
          style={{
            cursor: isOwnPost ? "not-allowed" : "pointer",
            opacity: isOwnPost ? 0.5 : 1,
          }}
        >
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
