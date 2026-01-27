import { create } from "zustand";

interface AppStore {
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
}

export const useAppStore = create<AppStore>((set) => ({
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
}));
