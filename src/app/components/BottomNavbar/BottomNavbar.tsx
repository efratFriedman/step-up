"use client";
import { navLinks } from "@/lib/navLinks";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useModalStore } from "@/app/store/useModalStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/app/store/useUserStore";
import { NAV_LINKS } from "@/config/navLinks";
import styles from "./BottomNavbar.module.css";

export default function BottomNavbar() {
    const user = useUserStore((state) => state.user);
    const pathName = usePathname();
    const openHabitModal = useModalStore((s) => s.openHabitModal);

    if(!user) return null;
    return (
        <nav className={styles.nav}>
            <div className={styles.navContainer}>
                {NAV_LINKS.map(({ href, icon: Icon, label }) => {
                    const isActive = pathName === href;

                    return (
                        <Link key={href} href={href}>
                            {isActive && (
                                <div className={styles.iconBackground} aria-hidden="true" />
                            )}

                            <Icon
                                size={22}
                                className={`transition-colors ${isActive ? "text-sky-800" : "text-gray-700"
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