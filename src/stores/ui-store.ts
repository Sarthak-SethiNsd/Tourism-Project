import { create } from "zustand";

type UiState = {
  isSearchOpen: boolean;
  isNavigationOpen: boolean;
  setSearchOpen: (isSearchOpen: boolean) => void;
  setNavigationOpen: (isNavigationOpen: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  isSearchOpen: false,
  isNavigationOpen: false,
  setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
  setNavigationOpen: (isNavigationOpen) => set({ isNavigationOpen }),
}));
