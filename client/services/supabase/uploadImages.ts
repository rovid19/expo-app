import { useUserStore } from "../../stores/userStore";
import { supabase } from "./supabaseClient";
import * as FileSystem from "expo-file-system/legacy";
import { Buffer } from "buffer";

export const uploadImages = async (
  images: string[],
  type: "update" | "insert"
) => {
  const user = useUserStore.getState().user;
  const isLocalUri = (uri: string) => /^(file|content):\/\//.test(uri);
  const toUpload = type === "insert" ? images : images.filter(isLocalUri);
  if (!toUpload.length) return images;

  const uploadedByUri = new Map<string, string>();

  await Promise.all(
    toUpload.map(async (uri) => {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      const buffer = Buffer.from(base64, "base64");

      if (buffer.byteLength === 0) {
        throw new Error("Empty buffer after base64 decode");
      }

      const ext = (uri.split(".").pop() || "jpg").split("?")[0];
      const path = `${user?.id ?? "anon"}/${Date.now()}-${Math.random()
        .toString(16)
        .slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(path, buffer, {
          contentType: `image/${ext}`,
        });

      if (error) throw error;

      const { data } = supabase.storage.from("images").getPublicUrl(path);
      uploadedByUri.set(uri, data.publicUrl);
    })
  );

  return images.map((uri) => uploadedByUri.get(uri) ?? uri);
};
