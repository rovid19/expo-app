import { supabase } from "./supabase/supabaseClient";
import api from "../lib/axios";
import type { Item } from "../globalTypes";

// services/items.service.ts
export class AppService {
  static async getUserExtra(userId: string) {
    const { data, error } = await supabase
      .from("user_extra")
      .select("*")
      .eq("owner_id", userId)
      .single();
    if (error) {
      console.error("Error getting app currency:", error);
    }
    return data;
  }

  static async updateUserExtra(userId: string, data: any) {
    const { data: updatedData, error } = await supabase
      .from("user_extra")
      .update(data)
      .eq("owner_id", userId)
      .single();
    if (error) {
      console.error("Error updating user extra:", error);
    }
    return updatedData;
  }

  static async checkIfUserExtraExists(userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from("user_extra")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error checking if user extra exists:", error);
      return false;
    }

    return data !== null;
  }

  static async createUserExtra(userId: string) {
    const { data, error } = await supabase
      .from("user_extra")
      .insert({ owner_id: userId, currency: "USD" });
    if (error) {
      console.error("Error creating user extra:", error);
    }
    return data;
  }
}
