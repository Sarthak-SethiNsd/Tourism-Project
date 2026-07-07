"use client";

import { useEffect } from "react";
import { subscribeToAuthState } from "@/features/authentication/services/authentication-service";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthStore } from "@/stores/auth-store";

export function useAuthUser() {
  const { user, isReady, setReady, setUser } = useAuthStore();

  useEffect(() => {
    if (!hasFirebaseConfig) {
      setReady(true);
      return;
    }

    return subscribeToAuthState((nextUser) => {
      setUser(nextUser);
      setReady(true);
    });
  }, [setReady, setUser]);

  return { user, isReady };
}
