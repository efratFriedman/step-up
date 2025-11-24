"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { sendTemporaryPassword } from "@/services/client/userService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const router = useRouter();
  const setTempEmail = useUserStore((state) => state.setTempEmail);
  const setTempPassword = useUserStore((state) => state.setTempPassword);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (cooldown > 0) return; 

    try {
      setLoading(true);
      const data = await sendTemporaryPassword(email);

      setTempEmail(email);
      setTempPassword(data.tempPassword);

      setCooldown(30); 

      router.push("/reset-password");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit" disabled={loading || cooldown > 0}>
        {cooldown > 0 ? `Wait ${cooldown}s` : "Send Temporary Password"}
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </form>
  );
}
