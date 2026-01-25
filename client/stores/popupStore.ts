// stores/popupStore.ts
import { create } from "zustand";
import { useAppStore } from "./appStore";
type PopupState = {
  requiresConfirmation: boolean;
  setRequiresConfirmation: (requiresConfirmation: boolean) => void;
  open: (content: React.ReactNode) => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  requiresConfirmation: false,
  setRequiresConfirmation: (requiresConfirmation: boolean) =>
    set({ requiresConfirmation }),
  open: (content: React.ReactNode) => {
    const { isModal, setIsModal } = useAppStore.getState();

    console.log("open popup", content);

    setIsModal({
      visible: true,
      content: isModal?.content,
      popupContent: content,
    });
  },
}));
