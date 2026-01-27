import { create } from "zustand";
import { ItemsService } from "../services/supabase/itemsServices";
import { useUserStore } from "./userStore";
import type { Item } from "../globalTypes";

interface Items2Store {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  itemType: "scanned" | "listed";
  setItemType: (itemType: "scanned" | "listed") => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  scannedItems: Item[];
  setScannedItems: (items: Item[]) => void;
  selectedItemId: string | null;
  setSelectedItemId: (itemId: string | null) => void;
  findSelectedItem: () => Item | null;
  fetchItems: () => Promise<void>;
  updateItemImages: (
    photoUri: string,
    action: "add" | "remove"
  ) => Promise<void>;
  addScannedItem: (item: Item) => void;
  saveItem: (item: Item, saveScannedItemAsListed?: boolean) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleItemSold: (sold: boolean) => Promise<void>;
}

export const useItems2Store = create<Items2Store>((set, get) => ({
  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  itemType: "listed",
  setItemType: (itemType: "scanned" | "listed") => set({ itemType }),
  items: [],
  setItems: (items: Item[]) => set({ items }),
  scannedItems: [],
  setScannedItems: (items: Item[]) => set({ scannedItems: items }),
  fetchItems: async () => {
    set({ isLoading: true });
    const user = useUserStore.getState().user;
    if (!user?.id) return;
    const items = await ItemsService.fetchUserItems(user.id);
    set({ items: items as Item[] });
    set({ isLoading: false });
  },
  selectedItemId: null,
  setSelectedItemId: (itemId: string | null) => set({ selectedItemId: itemId }),
  findSelectedItem: () => {
    const { itemType, items, scannedItems, selectedItemId } = get();
    const itemArray = itemType === "listed" ? items : scannedItems;
    const item = itemArray.find((item) => item.id === selectedItemId);
    return item ? structuredClone(item) : null;
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

    await ItemsService.updateItemImages(user.id, newImages, selectedItemId);
  },
  addScannedItem: (item: Item) => {
    set({ scannedItems: [...get().scannedItems, item] });
  },
  saveItem: async (item: Item, saveScannedItemAsListed: boolean = false) => {
    const { itemType, scannedItems, items } = get();
    const user = useUserStore.getState().user;
    if (!user?.id) return;
    if (!item) return;

    if (itemType === "scanned" && !saveScannedItemAsListed) {
      set({
        scannedItems: scannedItems.map((arrayItem) =>
          arrayItem.id === item.id ? item : arrayItem
        ),
      });
    } else {
      set({
        items: items.map((arrayItem) =>
          arrayItem.id === item.id ? item : arrayItem
        ),
      });
    }

    await ItemsService.saveItem(item, user.id);
  },

  removeItem: async (itemId: string) => {
    const { scannedItems, itemType, items } = get();
    const user = useUserStore.getState().user;
    if (!user?.id) return;

    if (itemType === "scanned") {
      set({ scannedItems: scannedItems.filter((item) => item.id !== itemId) });
    } else {
      set({ items: items.filter((item) => item.id !== itemId) });
      ItemsService.deleteItem(itemId, user.id);
    }
  },

  toggleItemSold: async (sold: boolean) => {
    const { items, findSelectedItem } = get();
    const user = useUserStore.getState().user;
    const itemToUpdate = findSelectedItem();
    if (!user?.id || !itemToUpdate) return;
    itemToUpdate.is_sold = sold;

    set({
      items: items.map((item) =>
        item.id === itemToUpdate.id ? itemToUpdate : item
      ),
    });

    ItemsService.saveItem(itemToUpdate, user.id);
  },
}));
