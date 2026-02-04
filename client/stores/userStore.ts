import { create } from "zustand";

interface UserStore {
  isSubscribed: boolean;
  setIsSubscribed: (isSubscribed: boolean) => void;   
  user: any | null;
  currency: "USD" | "EUR" | null;
  triggerDashboardRefresh: boolean;
  setUser: (user: any) => void;
  setCurrency: (currency: "USD" | "EUR") => void;
  setTriggerDashboardRefresh: (triggerDashboardRefresh: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  isSubscribed: false,
  setIsSubscribed: (isSubscribed: boolean) => set({ isSubscribed }),
  user: null,
  currency: "EUR",
  setUser: (user: any) => set({ user }),
  setCurrency: (currency: "USD" | "EUR") => set({ currency }),
  triggerDashboardRefresh: false,
  setTriggerDashboardRefresh: (triggerDashboardRefresh: boolean) =>
    set({ triggerDashboardRefresh }),
}));
