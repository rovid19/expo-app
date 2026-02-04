import { create } from "zustand";
import { PurchasesPackage } from "react-native-purchases";

interface AppStore {
  launchOpeningAnimation: boolean;
  setLaunchOpeningAnimation: (launchOpeningAnimation: boolean) => void;
  selectedPackage: PurchasesPackage | null;
  setSelectedPackage: (selectedPackage: PurchasesPackage | null) => void;
  hideNavbar: boolean;
  setHideNavbar: (hideNavbar: boolean) => void;
  isModal: {
    visible: boolean;
    content: React.ReactNode | null;
    popupContent: React.ReactNode | null;
  } | null;
  setIsModal: (isModal: {
    visible: boolean;
    content: React.ReactNode | null;
    popupContent: React.ReactNode | null;
  }) => void;
  closeModal: () => void;
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
  setCurrencySymbol: (currencySymbol: string) => void;
  name: string;
  setName: (name: string) => void;
  onboardingFinished: boolean;
  setOnboardingFinished: (onboardingFinished: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  launchOpeningAnimation: true,
  setLaunchOpeningAnimation: (launchOpeningAnimation: boolean) => set({ launchOpeningAnimation }),
  selectedPackage: null,
  setSelectedPackage: (selectedPackage: PurchasesPackage | null) => set({ selectedPackage }),
  isModal: {
    visible: false,
    content: null,
    popupContent: null,
  },
  setIsModal: (isModal: {
    visible: boolean;
    content: React.ReactNode | null;
    popupContent: React.ReactNode | null;
  }) => set({ isModal: isModal }),
  closeModal: () => {
    set((state) => ({
      isModal: state.isModal
        ? { ...state.isModal, visible: false }
        : state.isModal,
    }));

    setTimeout(() => {
      set(() => ({
        isModal: {
          visible: false,
          content: null,
          popupContent: null,
        },
      }));
    }, 500);
  },

  hideNavbar: false,
  setHideNavbar: (hideNavbar: boolean) => set({ hideNavbar }),
  currency: "USD",
  setCurrency: (currency: string) => set({ currency }),
  currencySymbol: "$",
  setCurrencySymbol: (currencySymbol: string) => set({ currencySymbol }),
  name: "John Doe",
  setName: (name: string) => set({ name }),
  onboardingFinished: false,
  setOnboardingFinished: (onboardingFinished: boolean) => set({ onboardingFinished }),
}));
