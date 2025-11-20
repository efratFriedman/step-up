"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { resetUserPassword } from "@/services/userService";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const tempEmail = useUserStore((state) => state.tempEmail);

  const handleReset = async () => {
    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    try {
      await resetUserPassword(tempEmail, newPassword);
      alert("Password updated successfully");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="Enter new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleReset}>Set New Password</button>
      {error && <p>{error}</p>}
    </div>
  );
}
