import { create } from "zustand";
import { ItemsService } from "../services/supabase/itemsServices";
import { useUserStore } from "./userStore";
import type { Item } from "../globalTypes";

interface Items2Store {
  items: Item[];
  setItems: (items: Item[]) => void;
  selectedItemId: number | null;
  setSelectedItemId: (itemId: number | null) => void;
  fetchItems: () => Promise<void>;
}

export const useItems2Store = create<Items2Store>((set) => ({
  items: [],
  setItems: (items: Item[]) => set({ items }),
  fetchItems: async () => {
    const user = useUserStore.getState().user;
    if (!user?.id) return;
    const items = await ItemsService.fetchUserItems(user.id);
    set({ items: items as Item[] });
  },
  selectedItemId: null,
  setSelectedItemId: (itemId: number | null) => set({ selectedItemId: itemId }),
}));
