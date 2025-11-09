"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import { FaEnvelope, FaLock, FaEye } from 'react-icons/fa';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
        router.push("/");
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
  
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <div className={styles.inputWrapper}>
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
              className={styles.inputField}
            />
            <FaEnvelope className={styles.icon} />
          </div>
        </div>
  
        <div className={styles.inputGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className={styles.inputField}
            />
            <FaEye 
               className={styles.icon} 
               onClick={() => setShowPassword(!showPassword)}
               style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
  

        {error && <p className={styles.error}>{error}</p>}
        
        <button type="submit" className={styles.loginButton}>
          Log In
        </button>
  
        <p className={styles.orDivider}>Or</p>

        <button type="button" className={styles.googleButton}>
          <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" 
              alt="Google logo" 
              className={styles.googleIcon} 
          />
          Sign in with Google
        </button>

        <p className={styles.signUpLink}>
          Don't have an Account? <a href="/signup" className={styles.signUpText}>Sign Up</a>
        </p>
  
      </form>
    );
}
