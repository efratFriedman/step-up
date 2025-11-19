"use client";
import { useState, useEffect } from "react";
import ProfileSidebar from "../Sidebar/Sidebar";
import styles from "./ProfileSidebarWrapper.module.css";
import { logout } from "@/services/authService";

export default function ProfileSidebarWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; profileImg?: string } | null>(null);
  useEffect(() => {
    const stored = localStorage.getItem("user-storage");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.state.user);
      } catch (err) {
        console.error("Failed to parse user-storage", err);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user-storage");
    setUser(null);
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
