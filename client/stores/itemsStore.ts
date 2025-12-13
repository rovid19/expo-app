import { create } from "zustand";
import { ScannedItem } from "../globalTypes";

interface ItemsStore {
  scannedItems: ScannedItem[];
  selectedScannedItem: ScannedItem | null;
  containerIndex: number;
  addScannedItem: (item: ScannedItem) => void;
  updateScannedItem: (index: number, item: ScannedItem) => void;
  setSelectedScannedItem: (item: ScannedItem | null) => void;
  setContainerIndex: (index: number) => void;
  addAdditionalPhoto: (uri: string) => void;
  removeAdditionalPhoto: (uri: string) => void;
}

export const useItemsStore = create<ItemsStore>((set) => ({
  scannedItems: [],
  selectedScannedItem: null,
  containerIndex: 0,

  addScannedItem: (item) =>
    set((state) => ({
      scannedItems: [...state.scannedItems, item],
      containerIndex: state.scannedItems.length,
      selectedScannedItem: item,
    })),

  updateScannedItem: (index, item) =>
    set((state) => {
      const updatedItems = [...state.scannedItems];
      updatedItems[index] = item;
      return {
        scannedItems: updatedItems,
        selectedScannedItem:
          state.containerIndex === index ? item : state.selectedScannedItem,
      };
    }),

  setSelectedScannedItem: (item) => set({ selectedScannedItem: item }),

  setContainerIndex: (index) =>
    set((state) => ({
      containerIndex: index,
      selectedScannedItem: state.scannedItems[index] || null,
    })),

  addAdditionalPhoto: (uri) =>
    set((state) => {
      if (!state.selectedScannedItem) return state;

      const currentImage = state.selectedScannedItem.image;
      const newImages = Array.isArray(currentImage)
        ? [...currentImage, uri]
        : [currentImage, uri];

      const updatedItem = { ...state.selectedScannedItem, image: newImages };
      const updatedItems = [...state.scannedItems];
      updatedItems[state.containerIndex] = updatedItem;

      return {
        scannedItems: updatedItems,
        selectedScannedItem: updatedItem,
      };
    }),

  removeAdditionalPhoto: (uri) =>
    set((state) => {
      if (!state.selectedScannedItem) return state;

      const currentImage = state.selectedScannedItem.image;
      if (!Array.isArray(currentImage)) return state;

      const filteredImages = currentImage.filter((img) => img !== uri);
      const newImage =
        filteredImages.length === 1 ? filteredImages[0] : filteredImages;

      const updatedItem = { ...state.selectedScannedItem, image: newImage };
      const updatedItems = [...state.scannedItems];
      updatedItems[state.containerIndex] = updatedItem;

      return {
        scannedItems: updatedItems,
        selectedScannedItem: updatedItem,
      };
    }),
}));
