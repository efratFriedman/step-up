import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error(" Google sign-in error:", error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(" Sign-out error:", error);
  }
}