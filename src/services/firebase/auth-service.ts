import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/services/firebase/client";

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(getFirebaseAuth(), provider);
}

export function signOutCurrentUser() {
  return signOut(getFirebaseAuth());
}
