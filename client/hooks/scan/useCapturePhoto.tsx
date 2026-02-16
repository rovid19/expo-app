import React, { useState } from "react";
import * as FileSystem from "expo-file-system/legacy";
import { Camera } from "react-native-vision-camera";
import { useItems2Store } from "../../stores/items2Store";
import * as MediaLibrary from "expo-media-library";
import { ItemsService } from "../../services/supabase/itemsServices";
import Toast from "react-native-toast-message";

interface useCapturePhotoProps {
  cameraRef: React.RefObject<Camera | null>;
  setStartAni?: (startAni: boolean) => void;
}

const useCapturePhoto = ({ cameraRef, setStartAni }: useCapturePhotoProps) => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const { updateItemImages, addScannedItem, selectedItemId } = useItems2Store();
  const handleCapture = async () => {
    if (!cameraRef.current) return;

    if (setStartAni) setStartAni(true);

    const photo = await cameraRef.current.takePhoto({
      flash: flashlightOn ? "on" : "off",
    });

    const sourceUri = photo.path.startsWith("file://")
      ? photo.path
      : `file://${photo.path}`;

    const filename = `${Date.now()}.jpg`;
    const destUri = FileSystem.documentDirectory! + filename;

    // ✅ COPY across volumes
    await FileSystem.copyAsync({
      from: sourceUri,
      to: destUri,
    });

    // ✅ DELETE temp file (best effort)
    FileSystem.deleteAsync(sourceUri, { idempotent: true }).catch(() => {});

    // Optional gallery export
    MediaLibrary.createAssetAsync(destUri).catch(() => {});

    // Store stable app-local URI
    if (!setStartAni) updateItemImages(destUri, "add");

    if (setStartAni) {
      const form = new FormData();
      form.append("file", {
        uri: `file://${photo.path}`,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);
      form.append("photoUri", destUri);

      try {
        const data = await ItemsService.scanItem(form);
        if (data) {
          addScannedItem(data);
        }
      } catch (error) {
        console.error("Error scanning item:", error);
        Toast.show({
          type: "error",
          text1: "Error scanning item",
          text2: "Please try again",
        });
        setStartAni(false);
      }

      setStartAni(false);
    }
  };

  return { handleCapture, flashlightOn, setFlashlightOn };
};

export default useCapturePhoto;
