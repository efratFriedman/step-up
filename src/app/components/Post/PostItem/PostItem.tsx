"use client";

import { useEffect, useRef, useState } from "react";
import { useUserStore } from "@/app/store/useUserStore";
import { IPost, IUserPopulated } from "@/interfaces/IPost";
import Slider from "../Slider/Slider";
import styles from "@/app/components/Post/PostItem/PostItem.module.css";
import { Heart, UserRound, Share2  } from "lucide-react";
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

  const [showShare, setShowShare] = useState(false);
  const shareRef = useRef<HTMLDivElement>(null);

  const BASE_URL = globalThis?.location?.origin ?? "";
  const postUrl = `${BASE_URL}/posts/${post._id}`;
  // const postUrl =
  //   typeof window !== "undefined"
  //     ? `${window.location.origin}/posts/${post._id}`
  //     : "";

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
        setShowShare(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "STEPUP Post",
          text: post.content,
          url: postUrl,
        });
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          toast.error("Failed to share post");
        }
      }
    } else {
      navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied!");
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
          <div ref={shareRef} className={styles.shareWrapper}>
            <Share2 className={styles.shareIcon} onClick={() => setShowShare((p) => !p)} />
            
            {showShare && (
              <div className={styles.shareMenu}>
                <button onClick={handleNativeShare}>
                  <img src="/images/share.jpg" alt="Copy link" className={styles.shareIconSmall} />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(postUrl);
                    toast.success("Post link copied!");
                    setShowShare(false);
                  }}
                >
                  <img src="/images/link.jpg" alt="Copy link" className={styles.shareIconSmall} />
                  <span>Copy link</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
