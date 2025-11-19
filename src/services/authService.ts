export async function loginService(email: string, password: string) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password");
  }

  return response.json();
}

export async function googleLoginService(userData: any) {
  const response = await fetch("/api/googleLogin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  return {
    ok: response.ok,
    status: response.status,
    data: await response.json(),
  };
}

export async function signupService(userData: any) {
  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return {
      ok: response.ok,
      data,
    };

  } catch (err) {
    console.error("signupService error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}


export async function googleSignupService(userData: any) {
  try {
    const response = await fetch("/api/googleSignup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    return {
      ok: response.ok,
      data,
    };

  } catch (err) {
    console.error("googleSignupService error:", err);
    return { ok: false, data: { message: "Network error" } };
  }
}

export async function logout(){
await fetch("/api/logout",{method:"POST"});
}