"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import { resetUserPassword } from "@/services/client/userService";
import { isValidPassword } from "@/services/server/validationService"; 

export default function NewPasswordComponent() {
  const router = useRouter();
  const tempEmail = useUserStore((state) => state.tempEmail);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSave = async () => {
    setError("");

    if (!password || !confirm) {
      setError("Please fill both fields");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    // בדיקה שהסיסמה עומדת בכללי האבטחה
    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
      return;
    }

    try {
      await resetUserPassword(tempEmail, password); 
      router.push("/"); 
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Create New Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />

      <button onClick={handleSave}>Save Password</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
