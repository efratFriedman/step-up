"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const setTempEmail = useUserStore((state) => state.setTempEmail);
  const setTempPassword = useUserStore((state) => state.setTempPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setTempEmail(email);
        setTempPassword(data.tempPassword);
        router.push("/reset-password");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
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
      <button type="submit">Send Temporary Password</button>
      {message && <p>{message}</p>}
    </form>
  );
}
