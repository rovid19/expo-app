import { create } from "zustand";
import * as MediaLibrary from "expo-media-library";
import { ScannedItem } from "../globalTypes";

interface ItemsStore {
  scannedItems: ScannedItem[];
  selectedScannedItem: ScannedItem | null;
  containerIndex: number;
  addScannedItem: (item: ScannedItem) => void;
  updateScannedItem: (index: number, item: ScannedItem) => void;
  setSelectedScannedItem: (item: ScannedItem | null) => void;
  setContainerIndex: (index: number) => void;
  addAdditionalPhoto: (uri: string) => Promise<void>;
  removeAdditionalPhoto: (uri: string) => Promise<void>;
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

  addAdditionalPhoto: async (uri) => {
    const state = useItemsStore.getState();

    if (!state.selectedScannedItem) return;

    const currentImage = state.selectedScannedItem.image;
    const newImages = currentImage
      ? Array.isArray(currentImage)
        ? [...currentImage, uri]
        : [currentImage, uri]
      : [uri];

    const updatedItem = { ...state.selectedScannedItem, image: newImages };
    const updatedItems = [...state.scannedItems];
    updatedItems[state.containerIndex] = updatedItem;

    useItemsStore.setState({
      scannedItems: updatedItems,
      selectedScannedItem: updatedItem,
    });

    // Save photo to album
    if (state.selectedScannedItem.detected_item) {
      try {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status === "granted") {
          const albumName = state.selectedScannedItem.detected_item;

          // Check if album exists, if not create it
          const albums = await MediaLibrary.getAlbumsAsync();
          let album = albums.find((a) => a.title === albumName);

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
        }
      } catch (error) {
        console.error("Error saving additional photo to album:", error);
      }
    }
  },

  removeAdditionalPhoto: async (uri) => {
    const state = useItemsStore.getState();
    if (!state.selectedScannedItem) return;

    const currentImage = state.selectedScannedItem.image;
    if (!Array.isArray(currentImage)) return;

    const filteredImages = currentImage.filter((img) => img !== uri);
    const newImage =
      filteredImages.length === 1 ? filteredImages[0] : filteredImages;

    const updatedItem = { ...state.selectedScannedItem, image: newImage };
    const updatedItems = [...state.scannedItems];
    updatedItems[state.containerIndex] = updatedItem;

    useItemsStore.setState({
      scannedItems: updatedItems,
      selectedScannedItem: updatedItem,
    });

    // Remove photo from album
    if (state.selectedScannedItem.detected_item) {
      try {
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status === "granted") {
          const albumName = state.selectedScannedItem.detected_item;

          // Find the album
          const albums = await MediaLibrary.getAlbumsAsync();
          const album = albums.find((a) => a.title === albumName);

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
      } catch (error) {
        console.error("Error removing additional photo from album:", error);
      }
    }
  },
}));
