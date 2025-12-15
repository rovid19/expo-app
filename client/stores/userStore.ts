import { create } from "zustand";

interface UserStore {
  user: any | null;
  currency: string | null;
  setUser: (user: any) => void;
  setCurrency: (currency: string) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  currency: "euro",
  setUser: (user: any) => set({ user }),
  setCurrency: (currency: string) => set({ currency }),
}));
