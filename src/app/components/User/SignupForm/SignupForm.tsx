"use client";

import { useState, ChangeEvent } from "react";
import styles from "./SignupForm.module.css";
import { FaUser, FaCalendarAlt, FaEnvelope, FaPhone, FaEye } from 'react-icons/fa';
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { mapUserToClient } from "@/utils/mapUser";
import { signupService, googleSignupService } from "@/services/authService";
import { signInWithGoogle } from "@/services/firebaseService";

export default function SignupForm() {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    birthDate: "",
    password: "",
    general: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  // RESET ERRORS
  const resetErrors = () => {
    setErrors({
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      password: "",
      general: "",
    });
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetErrors();

    // CLIENT-SIDE REQUIRED VALIDATION
    const newErrors: any = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    if (!phone) newErrors.phone = "Phone is required";
    if (!birthDate) newErrors.birthDate = "Birth date is required";
    if (!password) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    // SEND TO SERVER
    const { ok, data } = await signupService({
      name,
      password,
      birthDate,
      phone,
      email,
    });

    if (!ok) {
      // SERVER VALIDATION — ALL FIELDS TOGETHER
      if (data.errors) {
        setErrors((prev) => ({ ...prev, ...data.errors }));
      } else {
        setErrors((prev) => ({ ...prev, general: data.message }));
      }
      return;
    }

    // SUCCESS
    setUser(mapUserToClient(data.user));
    router.push("/");
  };

  // GOOGLE SIGNUP
  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);
    resetErrors();

    try {
      const user = await signInWithGoogle();

      const userData = {
        name: user.displayName,
        email: user.email,
        googleId: user.uid,
        profileImg: user.photoURL,
      };

      const { ok, data } = await googleSignupService(userData);

      if (!ok) {
        setErrors((prev) => ({ ...prev, general: data.message }));
        return;
      }

      setUser(mapUserToClient(data.user));
      router.push("/");
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, general: "Google signup failed" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer} noValidate>

      <h1 className={styles.title}>Sign Up</h1>

      {/* NAME */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Username</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            className={styles.inputField}
          />
          <FaUser className={styles.icon} />
        </div>
        {errors.name && <p className={styles.error}>{errors.name}</p>}
      </div>

      {/* BIRTHDATE */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Birth Date</label>
        <div className={styles.inputWrapper}>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={styles.inputField}
          />
          <FaCalendarAlt className={styles.icon} />
        </div>
        {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}
      </div>

      {/* EMAIL */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.inputField}
          />
          <FaEnvelope className={styles.icon} />
        </div>
        {errors.email && <p className={styles.error}>{errors.email}</p>}
      </div>

      {/* PHONE */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Phone</label>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            value={phone}
            placeholder="Enter phone number"
            onChange={(e) => setPhone(e.target.value)}
            className={styles.inputField}
          />
          <FaPhone className={styles.icon} />
        </div>
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
      </div>

      {/* PASSWORD */}
      <div className={styles.inputGroup}>
        <label className={styles.label}>Password</label>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className={styles.inputField}
          />
          <FaEye
            className={styles.icon}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: "pointer" }}
          />
        </div>
        {errors.password && <p className={styles.error}>{errors.password}</p>}
      </div>

      {/* GENERAL ERROR */}
      {errors.general && <p className={styles.error}>{errors.general}</p>}

      <button type="submit" className={styles.continueButton}>
        Continue
      </button>

      <p className={styles.orDivider}>Or</p>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={styles.googleButton}
      >
        Sign up with Google
      </button>
    </form>
  );
}