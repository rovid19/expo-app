// stores/popupStore.ts
import { create } from "zustand";

type PopupState = {
  visible: boolean;
  content: React.ReactNode | null;
  requiresConfirmation: {
    isTrue: boolean;
    action: (() => void) | null;
  };
  setRequiresConfirmation: (
    isTrue: boolean,
    action: (() => void) | null
  ) => void;
  open: (content: React.ReactNode) => void;
  close: () => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  visible: false,
  content: null,
  requiresConfirmation: {
    isTrue: false,
    action: null,
  },
  setRequiresConfirmation: (isTrue: boolean, action: (() => void) | null) =>
    set({
      requiresConfirmation: { isTrue, action },
    }),
  open: (content) => set({ visible: true, content }),
  close: () =>
    set((state) => ({
      ...state,
      visible: false,
      content: null,
      requiresConfirmation: { isTrue: false, action: null },
    })),
}));
