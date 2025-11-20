"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { generateTemporaryPassword } from "@/services/validationService";

export default function ForgotPassword() {
  const [emailInput, setEmailInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const tempPassword = useUserStore((state) => state.tempPassword);
  const setTempPassword = useUserStore((state) => state.setTempPassword);
  const setTempEmail = useUserStore((state) => state.setTempEmail);

  const handleSend = () => {
    if (!emailInput) {
      setError("Please enter your email");
      return;
    }

    // יוצרים סיסמה זמנית
    const generated = generateTemporaryPassword();

    // שמירת הסיסמה והאימייל ב-Zustand
    setTempPassword(generated);
    setTempEmail(emailInput);

    // כאן שולחים למייל – אפשר לקרוא לפונקציה ששולחת מייל ללא fetch
    // sendEmail(emailInput, generated);

    alert("Temporary password sent to email");
    setError("");
  };

  const handleVerify = () => {
    if (!tempPassword) {
      setError("Please request a temporary password first");
      return;
    }

    const input = prompt("Enter the temporary password you received in email:");
    if (input === tempPassword) {
      // עוברים לדף שינוי סיסמה
      router.push(`/reset-password?email=${encodeURIComponent(emailInput)}`);
    } else {
      alert("Incorrect temporary password");
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
      />
      <button onClick={handleSend}>Send Temporary Password</button>
      {error && <p>{error}</p>}
      <button onClick={handleVerify}>Verify Temporary Password</button>
    </div>
  );
}
