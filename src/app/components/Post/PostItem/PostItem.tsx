"use client";

import { useUserStore } from "@/app/store/useUserStore";
import { useLikeStore } from "@/app/store/useLikesStore";
import { IPost, IUserPopulated } from "@/interfaces/IPost";
import Slider from "../Slider/Slider";
import styles from "./PostItem.module.css";
import { Heart } from "lucide-react";

export default function PostItem({ post }: { post: IPost }) {
  const currentUser = useUserStore((state) => state.user);
  const { likeStatus, likeCount, toggle } = useLikeStore();

  const user = post.userId as IUserPopulated;

  const liked = likeStatus[post._id.toString()] ?? post.isLikedByCurrentUser;
  const likes = likeCount[post._id.toString()] ?? post.likesCount;

  const isOwnPost =
  currentUser?.id?.toString() === user._id?.toString();

  const onLike = () => {
    if (!isOwnPost) toggle(post._id.toString())
    ;
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
