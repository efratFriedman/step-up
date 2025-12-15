export async function updateUserService(userId: string, updateData: any) {
    const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });

    if (!res.ok) throw new Error("Failed to update user");

    return res.json();
}
export async function resetUserPassword(email: string, newPassword: string) {
    const res = await fetch("/api/users/reset-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });
  
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to reset password");
    }
  
    return res.json();
  }
  export async function sendTemporaryPassword(email: string) {
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.message || "Failed to send temporary password");
    }
  
    return data; 
  }

  export async function finishOnboardingService() {
  const res = await fetch("/api/finish-onboarding", {
    method: "POST",
  });

  if (!res.ok) {
    console.error("Failed to finish onboarding");
    return { ok: false };
  }

  return { ok: true };
}

  