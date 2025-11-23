"use client";
import { useState } from "react";
import ProfileSidebar from "../Sidebar/Sidebar";
import styles from "./ProfileSidebarWrapper.module.css";
import { logout } from "@/services/authService";
import { useUserStore } from "@/app/store/useUserStore";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/routes";

export default function ProfileSidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = async () => {
    await logout();
    router.replace(ROUTES.LOGIN);
    clearUser();
    setIsOpen(false);

  };

  if (!user) return null;

  return (
    <>
      <button className={styles.hamburger} onClick={() => setIsOpen(true)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ProfileSidebar
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onLogout={handleLogout}
      />
    </>
  );
}
