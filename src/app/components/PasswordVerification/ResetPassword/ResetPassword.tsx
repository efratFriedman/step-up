"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const [tempInput, setTempInput] = useState(""); // הסיסמה שהמשתמש מקיש
  const [error, setError] = useState("");
  const router = useRouter();

  const tempEmail = useUserStore((state) => state.tempEmail);
  const tempPassword = useUserStore((state) => state.tempPassword); // הסיסמה שנשלחה למייל

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
        <div>
          <h2 className={styles.title}>Verify Code</h2>
          <p className={styles.subtitle}>
            Please enter the temporary password sent to {tempEmail || "your email"}.
          </p>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Enter password from email"
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            className={styles.input}
          />
        </div>

        <button onClick={handleVerify} className={styles.button}>
          Verify Code
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}