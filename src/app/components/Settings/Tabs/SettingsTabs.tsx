import { useState } from 'react'
import styles from "@/app/components/Settings/Tabs/SettingsTabs.module.css"
import HabitsPanel from '../HabitsPanel/HabitsPanel';
import PostsPanel from '../PostsPanel/PostsPanel';
export default function SettingsTabs() {
    const [tab, setTab] = useState<"habits" | "posts">("habits");

    return (
        <div className={styles.wrapper}>
            <div className={styles.tabs}>
                <button
                    className={tab === "habits" ? styles.active : ""}
                    onClick={() => setTab("habits")}
                >
                    Habits
                </button>

                <button
                    className={tab === "posts" ? styles.active : ""}
                    onClick={() => setTab("posts")}
                >
                    Posts
                </button>
            </div>

            <div className={styles.content}>
                {tab === "habits" && <HabitsPanel />}
                {tab === "posts" && <PostsPanel />}
            </div>
        </div>
    );
}
