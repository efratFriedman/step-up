"use client";
import { useState, FormEvent, ChangeEvent, FocusEvent, MouseEvent } from "react";
import styles from "./SignupForm.module.css";
import { FaUser, FaCalendarAlt, FaEnvelope, FaPhone, FaEye } from 'react-icons/fa';

export default function SignupForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, birthDate, phone, email }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  const handleDateFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.currentTarget.type = 'date';
  }

  const handleDateBlur = (e: FocusEvent<HTMLInputElement>) => {
      if (!birthDate) {
          e.currentTarget.type = 'text';
      }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h1 className={styles.title}>Sign Up</h1>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Username</label>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            className={styles.inputField}
          />
          <FaUser className={styles.icon} />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>BirthDate</label>
        <div className={styles.inputWrapper}>
          <input
            type="text" 
            placeholder="Enter a date"
            value={birthDate}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}
            required
            className={styles.inputField}
            onFocus={handleDateFocus}
            onBlur={handleDateBlur}
          />
          <FaCalendarAlt className={styles.icon} />
        </div>
      </div>

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
        <label className={styles.label}>Phone</label>
        <div className={styles.inputWrapper}>
          <input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            required
            className={styles.inputField}
          />
          <FaPhone className={styles.icon} />
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

      <div className={styles.terms}>
        <input type="checkbox" id="terms-checkbox" required />
        <label htmlFor="terms-checkbox">
          I agree to the <span className={styles.termsLink}>Terms of Services</span> and <span className={styles.termsLink}>Privacy Policy.</span>
        </label>
      </div>

      <button type="submit" className={styles.continueButton}>
        Continue
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
      <p className={styles.signInLink}>
        Have an Account? <a href="/login" className={styles.signInText}>Sign In</a>
      </p>

      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
}
