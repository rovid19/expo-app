import { create } from "zustand";

interface ListingDetailsStore {
  isFacebookModalVisible: boolean;
  setIsFacebookModalVisible: (isFacebookModalVisible: boolean) => void;
  isAdditionalPhotosModalVisible: boolean;
  setIsAdditionalPhotosModalVisible: (
    isAdditionalPhotosModalVisible: boolean
  ) => void;
  isEditListingModalVisible: boolean;
  setIsEditListingModalVisible: (isEditListingModalVisible: boolean) => void;
}

export const useListingDetailsStore = create<ListingDetailsStore>((set) => ({
  isFacebookModalVisible: false,
  setIsFacebookModalVisible: (isFacebookModalVisible: boolean) =>
    set({ isFacebookModalVisible }),
  isAdditionalPhotosModalVisible: false,
  setIsAdditionalPhotosModalVisible: (
    isAdditionalPhotosModalVisible: boolean
  ) => set({ isAdditionalPhotosModalVisible }),
  isEditListingModalVisible: false,
  setIsEditListingModalVisible: (isEditListingModalVisible: boolean) =>
    set({ isEditListingModalVisible }),
}));
