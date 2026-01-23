import { create } from "zustand";
import { ItemsService } from "../services/supabase/itemsServices";
import { useUserStore } from "./userStore";
import type { Item } from "../globalTypes";

interface Items2Store {
  itemType: "scanned" | "listed";
  setItemType: (itemType: "scanned" | "listed") => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  scannedItems: Item[];
  setScannedItems: (items: Item[]) => void;
  selectedItemId: number | null;
  setSelectedItemId: (itemId: number | null) => void;
  findSelectedItem: () => Item | null;
  fetchItems: () => Promise<void>;
  updateItemImages: (
    photoUri: string,
    action: "add" | "remove"
  ) => Promise<void>;
  addScannedItem: (item: Item) => void;
}

export const useItems2Store = create<Items2Store>((set, get) => ({
  itemType: "listed",
  setItemType: (itemType: "scanned" | "listed") => set({ itemType }),
  items: [],
  setItems: (items: Item[]) => set({ items }),
  scannedItems: [],
  setScannedItems: (items: Item[]) => set({ scannedItems: items }),
  fetchItems: async () => {
    const user = useUserStore.getState().user;
    if (!user?.id) return;
    const items = await ItemsService.fetchUserItems(user.id);
    set({ items: items as Item[] });
  },
  selectedItemId: null,
  setSelectedItemId: (itemId: number | null) => set({ selectedItemId: itemId }),
  findSelectedItem: () => {
    const { itemType, items, scannedItems, selectedItemId } = get();
    const itemArray = itemType === "listed" ? items : scannedItems;
    return itemArray.find((item) => item.id === selectedItemId) || null;
  },

  updateItemImages: async (photoUri: string, action: "add" | "remove") => {
    const { selectedItemId, itemType, items, scannedItems, findSelectedItem } =
      get();
    const user = useUserStore.getState().user;

    if (!user?.id) return;
    if (selectedItemId == null) return;

    const currentImages = findSelectedItem()?.image ?? [];

    let newImages: string[];

    if (action === "add") {
      newImages = [...currentImages, photoUri];
    } else {
      newImages = currentImages.filter((uri) => uri !== photoUri);
    }

    const update = (arr: Item[]) =>
      arr.map((item) =>
        item.id === selectedItemId ? { ...item, image: newImages } : item
      );

    if (itemType === "listed") {
      set({ items: update(items) });
    } else {
      set({ scannedItems: update(scannedItems) });
    }

    await ItemsService.updateItemImages(user.id, newImages);
  },
  addScannedItem: (item: Item) => {
    set({ scannedItems: [...get().scannedItems, item] });
  },
}));
