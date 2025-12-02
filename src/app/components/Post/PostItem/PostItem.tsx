import { IPost } from "@/interfaces/IPost";
import Slider from "../Slider/Slider"; 
import styles from "./PostItem.module.css";

export default function PostItem({ post }: { post: IPost & { userId: { name: string; profileImg?: string } } }) {

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

      {post.media && post.media.length > 0 && (
        <Slider 
          items={post.media.map((item) => ({
            url: item.url,
            type: item.type, 
          }))} 
        />
      )}
      <p className={styles.postText}>{post.content}</p>
    </div>
  </div>
  );
}