"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModalStore } from "@/app/store/useModalStore";
import { useModalPostStore } from "@/app/store/usePostModelStore"
import { useUserStore } from "@/app/store/useUserStore";
import { NAV_LINKS } from "@/config/navLinks";
import styles from "./BottomNavbar.module.css";
import { useOnboardingStore } from "@/app/store/useOnboardingStore";


export default function BottomNavbar() {
  const user = useUserStore((state) => state.user);
  const pathName = usePathname();

  const openHabitModal = useModalStore((s) => s.openHabitModal);
  const openPostModal = useModalPostStore((s) => s.openPostModal);
  const isOnboardingActive  = useOnboardingStore((s) => s.isOnboardingActive);

  if (!user) return null;

  const isPostsPage = pathName === "/posts";

  return (
    <nav id="onboarding-bottom-nav" className={styles.nav}>
      <div className={styles.navContainer}>
        {NAV_LINKS.map(({ href, icon: Icon, label }) => {
          const isSelected = pathName === href;
          return (
            <Link key={href} href={href}>
              {isSelected && (
                <div className={styles.iconBackground} aria-hidden="true" />
              )}
              <Icon
                size={22}
                className={`transition-colors ${isSelected ? "text-sky-800" : "text-gray-700"
                  } relative z-10`}
                aria-label={label}
              />
            </Link>
          );
        })}

        <button
          id="onboarding-add-habit-button"
          disabled={isOnboardingActive}
          onClick={() => {
            if (isPostsPage) openPostModal();
            else openHabitModal();
          }}
          className={styles.addButton}
        >
          <span className={styles.plusSign}>+</span>
        </button>
      </div>
    </nav>
  );
}