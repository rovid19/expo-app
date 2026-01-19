import { create } from "zustand";

interface ListingDetailsStore {
  isEditDetails: boolean;
  setIsEditDetails: (isEditDetails: boolean) => void;
  isFacebookModalVisible: boolean;
  setIsFacebookModalVisible: (isFacebookModalVisible: boolean) => void;
}

export const useListingDetailsStore = create<ListingDetailsStore>((set) => ({
  isEditDetails: false,
  setIsEditDetails: (isEditDetails: boolean) => set({ isEditDetails }),
  isFacebookModalVisible: false,
  setIsFacebookModalVisible: (isFacebookModalVisible: boolean) =>
    set({ isFacebookModalVisible }),
}));
