"use client";
import { navLinks } from "@/lib/navLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModalStore } from "@/app/store/useModalStore";
import styles from "./BottomNavbar.module.css"; 

export default function BottomNavbar() {
  const pathName = usePathname();
  const openHabitModal = useModalStore((s) => s.openHabitModal);

  return (
    <nav className={styles.nav}> 
      <div className={styles.navContainer}>
        {navLinks.map(({ href, icon: Icon, label }) => {
          const isActive = pathName === href;

          return (
            <Link key={href} href={href}>
              {isActive && (
                <div className={styles.iconBackground} aria-hidden="true" />
              )}
              
              <Icon
                size={22}
                className={`transition-colors ${
                  isActive ? "text-sky-800" : "text-gray-700"
                } relative z-10`} 
                aria-label={label}
              />
            </Link>
          );
        })}

        <button
          onClick={() => openHabitModal()}
          className={styles.addButton} 
        >
          <span className={styles.plusSign}>+</span> 
        </button>
      </div>
    </nav>
  );
}