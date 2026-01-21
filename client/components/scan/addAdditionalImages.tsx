import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useItemsStore } from "../../stores/itemsStore";
import AdditionalImageContainer from "./additionalImageContainer";
import CameraToolbar from "../cameraToolbar";
import { Camera, useCameraPermission } from "react-native-vision-camera";
import useCameraDevicesHook from "../../hooks/useCameraDevicesHook";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 70;
const BUTTON_X = SCREEN_WIDTH / 2;
const BUTTON_Y = SCREEN_HEIGHT - 120;

const AddAdditionalImages = () => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const { selectedScannedItem, addPhoto } = useItemsStore();
  const { currentDevice, setCurrentDevice } = useCameraDevicesHook();

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePhoto({
      flash: flashlightOn ? "on" : "off",
    });

    // Vision Camera gives a raw path → convert to file URI
    const tempUri = `file://${photo.path}`;

    const filename = `${Date.now()}.jpg`;
    const appUri = FileSystem.documentDirectory + filename;

    // Move into app-owned storage (this is critical)
    await FileSystem.moveAsync({
      from: tempUri,
      to: appUri,
    });

    // Copy to gallery (do NOT rely on this)
    MediaLibrary.createAssetAsync(appUri).catch(() => {});

    // Store ONLY the app URI
    addPhoto(appUri);
  };

  useEffect(() => {
    if (!hasPermission) requestPermission();
    MediaLibrary.requestPermissionsAsync();
  }, []);

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-black items-center pt-24">
        <Text className="text-white text-base text-center">
          Camera permission required
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="mt-5 bg-lime-400 px-6 py-3 rounded-lg"
        >
          <Text className="text-gray-900 font-semibold text-base">
            Grant Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentDevice) {
    return (
      <View className="flex-1 bg-black items-center видно pt-24">
        <Text className="text-white text-base">Loading camera...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <Camera
        ref={cameraRef}
        className="flex-1"
        device={currentDevice}
        isActive
        photo
      />

      {/* overlay */}
      <View className="absolute inset-0" pointerEvents="box-none">
        {/* top toolbar */}
        <View className="absolute top-0 z-20 w-full px-4 pt-16 h-30 items-center">
          <CameraToolbar
            onDeviceChange={setCurrentDevice}
            onFlashlightChange={setFlashlightOn}
          />
        </View>

        {/* thumbnails */}
        {/*selectedScannedItem?.image?.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="absolute w-full h-[120px]"
            contentContainerClassName="px-5 flex-row items-center gap-1"
            style={{
              top: BUTTON_Y - BUTTON_SIZE / 2 - 120,
            }}
          >
            {selectedScannedItem.image.map((uri, index) => (
              <View key={`${uri}-${index}`} className="mr-3">
                <AdditionalImageContainer uri={uri} />
              </View>
            ))}
          </ScrollView>
        )}*/}

        {/* capture button */}
        <TouchableOpacity
          onPress={handleCapture}
          className="absolute w-[70px] h-[70px] rounded-full"
          style={{
            left: BUTTON_X - BUTTON_SIZE / 2,
            top: BUTTON_Y - BUTTON_SIZE / 2,
          }}
        >
          <View className="flex-1 rounded-full border-4 border-white p-1">
            <View className="flex-1 rounded-full bg-white" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddAdditionalImages;
