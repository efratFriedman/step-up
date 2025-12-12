"use client";

import { useState } from "react";

import { useUserStore } from "@/app/store/useUserStore";
import { IPost, IUserPopulated } from "@/interfaces/IPost";
import Slider from "../Slider/Slider";
import styles from "@/app/components/Post/PostItem/PostItem.module.css";
import { Heart, UserRound } from "lucide-react";
import { usePostStore } from "@/app/store/usePostStore";
import { translateText } from "@/services/client/postService";
import toast from "react-hot-toast";

export default function PostItem({ post }: { post: IPost }) {
  const currentUser = useUserStore((state) => state.user);
  const toggleLike = usePostStore((s) => s.toggleLikeAction);

  const user = post.userId as IUserPopulated;
  const hasProfileImage = Boolean(user.profileImg);

  const liked = post.isLikedByCurrentUser;
  const likes = post.likesCount;

  const isOwnPost =
    currentUser?.id?.toString() === user._id?.toString();

  const onLike = () => {
    if (!isOwnPost) toggleLike(String(post._id));
  };

  const [translated, setTranslated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const userLang =
    typeof window !== "undefined"
      ? navigator.language.split("-")[0]
      : "en";

  const handleTranslate = async () => {
    if (translated) {
      setShowOriginal((prev) => !prev);
      return;
    }

    setIsLoading(true);

    const res = await translateText(post.content, userLang);
    setIsLoading(false);

    if (res.translatedText) {
      setTranslated(res.translatedText);
    } else {
      toast.error("Translation temporarily unavailable.");
    }
  };

  return (
    <div className={styles.postItem}>
      <div className={styles.profile}>
        {hasProfileImage ? (
          <img
            src={user.profileImg}
            alt={user.name}
            className={styles.profileImg}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) fallback.classList.add(styles.showIcon);
            }}
          />
        ) :  <UserRound
          className={`${styles.avatarIcon} ${
            hasProfileImage ? styles.hiddenIcon : ""
          }`}
        />}

        <p className={styles.userName}>{user.name}</p>
      </div>

      <div className={styles.content}>
        {post.media?.length > 0 && (
          <div className={styles.mediaBox}>
            <Slider
              items={post.media.map((item) => ({
                url: item.url,
                type: item.type,
              }))}
            />
          </div>
        )}

        <p className={styles.postText}>
          {!translated || showOriginal ? post.content : translated}
        </p>

        {/* ⭐ TRANSLATION BUTTON */}
        <button
          className={styles.translateBtn}
          onClick={handleTranslate}
          disabled={isLoading}
        >
          {isLoading
            ? "Translating..."
            : translated
            ? showOriginal
              ? "Show translation"
              : "Show original"
            : "Translate"}
        </button>

        <div className={styles.actionsRow}>
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
    </div>
  );
}
