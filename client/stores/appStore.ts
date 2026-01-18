import { create } from "zustand";

interface AppStore {
  hideNavbar: boolean;
  setHideNavbar: (hideNavbar: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  hideNavbar: false,
  setHideNavbar: (hideNavbar: boolean) => set({ hideNavbar }),
}));
