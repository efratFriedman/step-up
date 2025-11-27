'use client';

import { useEffect, useState } from "react";
import styles from "./GrowthTree.module.css";

interface GrowthTreeProps {
    completedCount: number;
}

export default function GrowthTree({ completedCount }: GrowthTreeProps) {
    const [animateLeaves, setAnimateLeaves] = useState(false);

    useEffect(() => {
        setAnimateLeaves(true);
        const timer = setTimeout(() => {
            setAnimateLeaves(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [completedCount]);

    const getGrowthLevel = () => {
        if (completedCount === 0) return 0;
        if (completedCount < 5) return 1;
        if (completedCount < 15) return 2;
        if (completedCount < 30) return 3;
        if (completedCount < 50) return 4;
        return 5;
    }
    const growthLevel = getGrowthLevel();
    const getTreeEmoji = () => {
        switch (growthLevel) {
          case 0: return "🌱";
          case 1: return "🌿";
          case 2: return "🪴";
          case 3: return "🌳";
          case 4: return "🌲";
          case 5: return "🌴";
          default: return "🌱";
        }
      };

      const getGrowthMessage = () => {
        switch (growthLevel) {
          case 0: return "Start your week strong!";
          case 1: return "Great start this week!";
          case 2: return "Growing nicely this week!";
          case 3: return "Amazing week so far!";
          case 4: return "Almost there this week!";
          case 5: return "Perfect week! 🎉";
          default: return "Start growing!";
        }
      };


        return (
            <div className={styles.card}>
              <div className={styles.header}>
                <h3 className={styles.title}>Weekly Growth Tree</h3>
              </div>
        
              <div className={styles.treeContainer}>
                <div className={styles.tree}>
                  <div className={styles.treeEmoji}>{getTreeEmoji()}</div>
                </div>
              </div>
        
              <div className={styles.message}>{getGrowthMessage()}</div>
        
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${Math.min((completedCount / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          );

}