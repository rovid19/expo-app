import { supabase } from "./supabaseClient";

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
}
