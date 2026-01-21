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
    const { selectedItemId, items, itemType, scannedItems } = get();
    const itemArray = itemType === "listed" ? items : scannedItems;
    return itemArray.find((item) => item.id === selectedItemId) || null;
  },
}));
