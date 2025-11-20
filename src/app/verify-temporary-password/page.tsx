"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

export default function VerifyTempPassword() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const tempPassword = useUserStore((state) => state.tempPassword);

  const handleVerify = () => {
    if (input === tempPassword) {
      router.push("/reset-password");
    } else {
      setError("Incorrect temporary password");
    }
  };

  return (
    <div>
      <h2>Verify Temporary Password</h2>
      <input
        type="text"
        placeholder="Enter temporary password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleVerify}>Verify</button>
      {error && <p>{error}</p>}
    </div>
  );
}
