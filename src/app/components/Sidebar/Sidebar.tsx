"use client";
import { img } from "framer-motion/m";
import styles from "./Sidebar.module.css";

interface IUserFront {
  name: string;
  email: string;
  profileImg?: string;
}

interface ProfileSidebarProps {
  user: IUserFront;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function ProfileSidebar({ user, isOpen, onClose, onLogout }: ProfileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        {/* {user.profileImg && <img src={user.profileImg} alt={user.name} className={styles.profileImg} />} */}
        <div className={styles.profileImgWrapper}>
        {user.profileImg ? (
          <img
            src={user.profileImg}
            alt={user.name}
            className={styles.profileImg}
          />
        ) : (
          <div className={`${styles.profileImg} ${styles.placeholderImg}`} />
        )}
      </div>

        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.email}>{user.email}</p>
        <button className={styles.logoutBtn} onClick={onLogout}>Log Out</button>
      </div>
    </div>
  );
}
