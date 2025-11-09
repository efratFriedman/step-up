"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css"; // אם את רוצה להוסיף עיצוב בהמשך

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        router.push("/"); // ניתוב הביתה אחרי התחברות
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Log In</h2>

      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit">Log In</button>
    </form>
  );
}
