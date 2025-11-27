import { IPost } from "@/interfaces/IPost";
import styles from "./PostItem.module.css";

export default function PostItem({ post }: { post: IPost & { userId: { name: string; profileImg?: string } } }) {
  const getMediaGridClass = (count: number) => {
    if (count === 1) return styles.single;
    if (count === 2) return styles.double;
    if (count === 3) return styles.triple;
    if (count === 4) return styles.four;
    return styles.multiple;
  };

  const mediaCount = post.media?.length || 0;

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
        <p className={styles.postText}>{post.content}</p>

        {/* מדיה - רק אם יש */}
        {post.media && post.media.length > 0 && (
          <div className={`${styles.mediaGrid} ${getMediaGridClass(mediaCount)}`}>
            {post.media.map((item, index) =>
              item.type === "video" ? (
                <video 
                  key={index} 
                  src={item.url} 
                  controls 
                  className={styles.media}
                  preload="metadata"
                />
              ) : (
                <img 
                  key={index} 
                  src={item.url} 
                  alt={`תמונה ${index + 1}`}
                  className={styles.media} 
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}