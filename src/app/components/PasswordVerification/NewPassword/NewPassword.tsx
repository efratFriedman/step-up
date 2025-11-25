"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { resetUserPassword } from "@/services/client/userService";
import { isValidPassword } from "@/services/server/validationService"; 
import styles from "./NewPassword.module.css";

export default function NewPasswordComponent() {
  const router = useRouter();
  const tempEmail = useUserStore((state) => state.tempEmail);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!password || !confirm) {
      setError("Please fill both fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    try {
      await resetUserPassword(tempEmail, password); 
      router.push("/"); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div>
          <h2 className={styles.title}>New Password</h2>
          <p className={styles.subtitle}>
            Create a new, strong password for your account.
          </p>
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={styles.input}
          />
        </div>

        <button onClick={handleSave} className={styles.button}>
          Save Password
        </button>

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </div>
  );
}