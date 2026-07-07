import type { User } from "firebase/auth";
import { create } from "zustand";

type AuthState = {
  user: User | null;
  isReady: boolean;
  setUser: (user: User | null) => void;
  setReady: (isReady: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isReady: false,
  setUser: (user) => set({ user }),
  setReady: (isReady) => set({ isReady }),
}));
