"use client";
import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginForm.module.css";
import { FaEnvelope, FaEye } from 'react-icons/fa';
import { signInWithGoogle } from "@/services/firebaseService";
import { useUserStore } from "@/app/store/useUserStore";
import { mapUserToClient } from "@/utils/mapUser";
import { loginService, googleLoginService } from "@/services/authService";
import { ROUTES } from "@/config/routes";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const data = await loginService(email, password);
      setUser(data.user);
      router.push(ROUTES.HOME);
    } catch {
      setError("Invalid email or password");
    }
  };
  
  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
  
    try {
      const user = await signInWithGoogle();
      const userData = {
        email: user.email,
        googleId: user.uid,
        name: user.displayName,
        profileImg: user.photoURL
      };
  
      const { ok, status, data } = await googleLoginService(userData);
  
      if (ok) {
        setUser(mapUserToClient(data.user));
        alert(data.message);
        router.push(ROUTES.HOME);
      } else if (status === 404) {
        router.push(ROUTES.SIGNUP);
      } else {
        setError(data.message || "Something went wrong");
      }
      // setUser(data.user);
      
    } catch (error: any) {
      console.error("Google sign-in error:", error.code || error);
      setError("Something went wrong during Google sign-in");
  
    } finally {
      setLoading(false);
    }  
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <img className={styles.logoImg} src="/fullLogo.png" alt="full logo" />
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

      <button
        type="button"
        className={styles.googleButton}
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="Google logo"
          className={styles.googleIcon}
        />
        {loading ? "Signing in..." : "Sign in with Google"}
      </button>

      <p className={styles.signUpLink}>
        Don't have an Account? <a href="/signup" className={styles.signUpText}>Sign Up</a>
      </p>

    </form>
  );
}