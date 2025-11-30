"use client";

import { useState } from "react";
import { challenges } from "@/utils/challenges";
import styles from './FortuneFunChallenge.module.css';

  export default function FortuneFunChallenge() {
    const [gameState, setGameState] = useState('idle'); 
    const [challenge, setChallenge] = useState("");

    const handleCrackCookie = () => {
        if(gameState !== 'idle'){
            return;
        }

        setGameState('cracking');
        const random = challenges[Math.floor(Math.random() * challenges.length)];
        setChallenge(random);
        
        setTimeout(() => {
            setGameState('result');
          }, 2000);
    };

    return (
        <div className={styles.card}>
        {gameState !== 'result' && (
          <div 
            className={`${styles.cookieContainer} ${gameState === 'cracking' ? styles.crackingAnim : ''}`} 
            onClick={handleCrackCookie}
          >
            <img 
              src="/images/ChatGPT Image Nov 30, 2025, 09_44_13 AM.png" 
              alt="Fortune Cookie" 
              className={styles.cookieImg}
            />
            {gameState === 'idle' && (
              <p className={styles.ctaText}>Tap to crack open! 🥠</p>
            )}
          </div>
        )}
        {gameState === 'result' && (
          <div className={styles.resultContainer}>
            <p className={styles.title}>Fun Challenge 🎯</p>
            <p className={styles.text}>{challenge}</p>
          </div>
        )}
      </div>
    );
  }