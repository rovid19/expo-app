// stores/popupStore.ts
import { create } from "zustand";

type PopupState = {
  isFullscreen: boolean;
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
  open: (content: React.ReactNode, isFullscreen?: boolean) => void;
  close: () => void;
};

export const usePopupStore = create<PopupState>((set) => ({
  isFullscreen: false,
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
  open: (content, isFullscreen = false) =>
    set({ visible: true, content, isFullscreen }),
  close: () =>
    set((state) => ({
      ...state,
      visible: false,
      content: null,
      requiresConfirmation: { isTrue: false, action: null },
    })),
}));
