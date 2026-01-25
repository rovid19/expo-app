import { supabase } from "./supabaseClient";
import api from "../../lib/axios";
import type { Item } from "../../globalTypes";

// services/items.service.ts
export class ItemsService {
  static async fetchUserItems(userId: string) {
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("owner_id", userId);
    if (error) {
      console.error("Error fetching user items:", error);
    }

    return data;
  }

  static async updateItemImages(
    userId: string,
    photoUriArray: string[],
    itemId: string
  ) {
    const { data, error } = await supabase
      .from("items")
      .update({ image: photoUriArray })
      .eq("owner_id", userId)
      .eq("id", itemId);

    if (error) {
      console.error("Error updating item images:", error);
    }
    return data;
  }

  static async scanItem(image: FormData) {
    let res: any = null;
    try {
      res = await api.post("/scan/image-scan", image);
    } catch (error) {
      console.error("Error scanning item:", error);
    }
    return res.data.scannedItem;
  }

  static async saveItem(item: Item, userId: string) {
    const { data, error } = await supabase.from("items").upsert({
      ...item,
      owner_id: userId,
    });
    if (error) {
      console.error("Error saving item:", error);
    }
    return data;
  }

  static async deleteItem(itemId: string, userId: string) {
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId)
      .eq("owner_id", userId);
    if (error) {
      console.error("Error deleting item:", error);
    }
  }

  static async updateItemDetails(item: Item, userId: string) {
    const { data, error } = await supabase
      .from("items")
      .update(item)
      .eq("id", item.id)
      .eq("owner_id", userId);
    if (error) {
      console.error("Error updating item details:", error);
    }
    return data;
  }
}
