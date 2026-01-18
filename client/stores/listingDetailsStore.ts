import { create } from "zustand";

interface ListingDetailsStore {
  isEditDetails: boolean;
  setIsEditDetails: (isEditDetails: boolean) => void;
}

export const useListingDetailsStore = create<ListingDetailsStore>((set) => ({
  isEditDetails: false,
  setIsEditDetails: (isEditDetails: boolean) => set({ isEditDetails }),
}));
