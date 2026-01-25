import { create } from "zustand";

interface AppStore {
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

  hideNavbar: boolean;
  setHideNavbar: (hideNavbar: boolean) => void;
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
}));
