import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { create } from "zustand";
import React from "react";
interface ListingDetailsStore {
  isListingDetailsOpen: boolean;
  setIsListingDetailsOpen: (isListingDetailsOpen: boolean) => void;
  listingDetailsBottomSheetRef: React.RefObject<BottomSheetModal> | null;
  setListingDetailsBottomSheetRef: (
    listingDetailsBottomSheetRef: React.RefObject<BottomSheetModal>
  ) => void;
  openListingDetails: () => void;
  closeListingDetails: () => void;
}

export const useListingDetailsStore = create<ListingDetailsStore>(
  (set, get) => ({
    isListingDetailsOpen: false,
    setIsListingDetailsOpen: (isListingDetailsOpen: boolean) =>
      set({ isListingDetailsOpen }),
    openListingDetails: () => {
      get().listingDetailsBottomSheetRef?.current?.snapToIndex(0);
      set({ isListingDetailsOpen: true });
    },
    closeListingDetails: () => {
      get().listingDetailsBottomSheetRef?.current?.close();
      set({ isListingDetailsOpen: false });
    },
    listingDetailsBottomSheetRef: null,
    setListingDetailsBottomSheetRef: (
      listingDetailsBottomSheetRef: React.RefObject<BottomSheetModal>
    ) => set({ listingDetailsBottomSheetRef }),
  })
);
