"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [tempInput, setTempInput] = useState(""); 
  const [error, setError] = useState("");
  const router = useRouter();

  const tempEmail = useUserStore((state) => state.tempEmail);
  const tempPassword = useUserStore((state) => state.tempPassword); 

  const handleVerify = async () => {
    setError("");
    if (tempInput !== tempPassword) {
      setError("Temporary password is incorrect");
      return;
    }

    try {
      router.push("/new-password"); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Verify Temporary Password</h2>
          <p>Please enter the temporary password sent to {tempEmail}.</p>
  
          <input
            type="password"
            placeholder="Enter temporary password"
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            className={styles.input}
          />
  
          <button onClick={handleVerify} className={styles.button}>
            Verify
          </button>
  
          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
  );
}