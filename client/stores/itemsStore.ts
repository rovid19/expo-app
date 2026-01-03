import { create } from "zustand";
import * as MediaLibrary from "expo-media-library";
import { ScannedItem } from "../globalTypes";
import api from "../lib/axios";

interface ItemsStore {
  scannedItems: ScannedItem[];
  selectedScannedItem: ScannedItem | null;
  containerIndex: number;
  addScannedItem: (item: ScannedItem) => void;
  updateScannedItem: (index: number, item: ScannedItem) => void;
  setSelectedScannedItem: (item: ScannedItem | null) => void;
  setContainerIndex: (index: number) => void;
  removeScannedItem: (item: ScannedItem) => void;
  addPhoto: (uri: string) => Promise<void>;
  addOrRemovePhotoFromAlbum: (
    selectedScannedItem: ScannedItem,
    uri: string,
    type: "add" | "remove"
  ) => Promise<void>;
  removePhoto: (uri: string) => Promise<void>;
  removePhotoFromSupabase: (uri: string) => Promise<void>;
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

  removeScannedItem: (item) =>
    set((state) => ({
      scannedItems: state.scannedItems.filter(
        (i) => i.detected_item !== item.detected_item
      ),
      selectedScannedItem: null,
      containerIndex: 0,
    })),

  addPhoto: async (uri) => {
    const {
      selectedScannedItem,
      scannedItems,
      containerIndex,
      addOrRemovePhotoFromAlbum,
    } = useItemsStore.getState();

    if (!selectedScannedItem) return;

    const images = [
      ...(Array.isArray(selectedScannedItem.image)
        ? selectedScannedItem.image
        : selectedScannedItem.image
        ? [selectedScannedItem.image]
        : []),
      uri,
    ];

    const updatedItem = { ...selectedScannedItem, image: images };

    useItemsStore.setState({
      selectedScannedItem: updatedItem,
      scannedItems: scannedItems.map((item, i) =>
        i === containerIndex ? updatedItem : item
      ),
    });

    await addOrRemovePhotoFromAlbum(updatedItem, uri, "add");
  },

  removePhoto: async (uri) => {
    const {
      selectedScannedItem,
      scannedItems,
      containerIndex,
      removePhotoFromSupabase,
      addOrRemovePhotoFromAlbum,
    } = useItemsStore.getState();

    if (!selectedScannedItem) return;

    const currentImages = Array.isArray(selectedScannedItem.image)
      ? selectedScannedItem.image
      : selectedScannedItem.image
      ? [selectedScannedItem.image]
      : [];

    const images = currentImages.filter((img) => img !== uri);

    await removePhotoFromSupabase(uri);

    const updatedItem = {
      ...selectedScannedItem,
      image: images,
    };

    useItemsStore.setState({
      selectedScannedItem: updatedItem as ScannedItem,
      scannedItems: scannedItems.map((item, i) =>
        i === containerIndex
          ? (updatedItem as ScannedItem)
          : (item as ScannedItem)
      ),
    });

    await addOrRemovePhotoFromAlbum(updatedItem as ScannedItem, uri, "remove");
  },

  addOrRemovePhotoFromAlbum: async (
    selectedScannedItem: ScannedItem,
    uri: string,
    type: "add" | "remove"
  ) => {
    if (selectedScannedItem.detected_item) {
      try {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status === "granted") {
          const albumName = selectedScannedItem.detected_item;

          // Check if album exists, if not create it
          const albums = await MediaLibrary.getAlbumsAsync();
          let album = albums.find((a) => a.title === albumName);
          if (type === "add") {
            if (!album) {
              album = await MediaLibrary.createAlbumAsync(albumName);
            }

            // Save photo to the album
            if (album) {
              const asset = await MediaLibrary.createAssetAsync(uri);
              await MediaLibrary.addAssetsToAlbumAsync(
                [asset.id],
                album.id,
                false
              );
            }
          } else {
            if (album) {
              // Get all assets in the album
              const albumAssets = await MediaLibrary.getAssetsAsync({
                album: album.id,
                mediaType: MediaLibrary.MediaType.photo,
              });

              // Find the asset matching the URI
              const assetToRemove = albumAssets.assets.find(
                (asset) => asset.uri === uri
              );

              // Delete the asset (which removes it from all albums)
              if (assetToRemove) {
                await MediaLibrary.deleteAssetsAsync([assetToRemove.id]);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error saving additional photo to album:", error);
      }
    }
  },
  removePhotoFromSupabase: async (uri) => {
    if (!uri.startsWith("http")) return;
    try {
      const response = await api.post("/scan/remove-photo-from-supabase", {
        uri,
      });
      console.log("Response:", response.status, response.data);
    } catch (error: any) {
      // Ignore 404 errors - image might already be deleted or not exist
      if (error?.response?.status !== 404) {
        console.error("Error removing image:", error);
      }
    }
  },
}));
