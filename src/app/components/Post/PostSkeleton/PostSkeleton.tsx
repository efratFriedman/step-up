import React from 'react';
import styles from './PostSkeleton.module.css';

const PostSkeleton = () => {
  return (
    <div className={styles.skeletonPost}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonAvatar}></div>
        <div className={styles.skeletonUserInfo}>
          <div className={styles.skeletonUsername}></div>
          <div className={styles.skeletonTimestamp}></div>
        </div>
      </div>
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonTextLine}></div>
        <div className={styles.skeletonTextLine}></div>
        <div className={`${styles.skeletonTextLine} ${styles.short}`}></div>
      </div>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonActions}>
        <div className={styles.skeletonActionBtn}></div>
        <div className={styles.skeletonActionBtn}></div>
        <div className={styles.skeletonActionBtn}></div>
      </div>
    </div>
  );
};

const PostSkeletonList = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </>
  );
};

export { PostSkeleton, PostSkeletonList };
export default PostSkeleton;