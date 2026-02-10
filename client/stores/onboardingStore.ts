// stores/popupStore.ts
import { create } from "zustand";

type OnboardingState = {
  isOnboarding: boolean;
  setIsOnboarding: (isOnboarding: boolean) => void;
  onboardingStep: number;
  setOnboardingStep: (onboardingStep: number) => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  isOnboarding: false,
  setIsOnboarding: (isOnboarding: boolean) => set({ isOnboarding }),
  onboardingStep: 0,
  setOnboardingStep: (onboardingStep: number) => set({ onboardingStep }),
}));
