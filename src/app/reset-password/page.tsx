"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

export default function ResetPasswordPage() {
  const tempEmail = useUserStore((state) => state.tempEmail);
  const tempPassword = useUserStore((state) => state.tempPassword);

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: tempEmail, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Password updated successfully!");
        router.push("/login");
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
      <h2>Reset Password</h2>
      <p>Temporary password sent to: {tempEmail}</p>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Set New Password</button>
      {message && <p>{message}</p>}
    </form>
  );
}
