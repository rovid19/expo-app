import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import AdditionalImageContainer from "./additionalImageContainer";
import CameraToolbar from "../cameraToolbar";
import { Camera, useCameraPermission } from "react-native-vision-camera";
import useCameraDevicesHook from "../../hooks/useCameraDevicesHook";
import * as MediaLibrary from "expo-media-library";
import { useItems2Store } from "../../stores/items2Store";
import { BlurView } from "expo-blur";
import useCapturePhoto from "../../hooks/useCapturePhoto";

const AddAdditionalImages = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const { currentDevice, setCurrentDevice } = useCameraDevicesHook();
  const { findSelectedItem } = useItems2Store();
  const { handleCapture, flashlightOn, setFlashlightOn } = useCapturePhoto({
    cameraRef,
  });
  const item = findSelectedItem();
  if (!item) return null;

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
    <View className="flex-1 bg-dark1">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={currentDevice}
        isActive={true}
        photo
        torch={flashlightOn ? "on" : "off"}
      />

      {/* overlay */}
      <View className="absolute inset-0 flex flex-col" pointerEvents="box-none">
        {/* top toolbar */}
        <View className=" z-20 w-full px-4 pt-16 h-30 items-center">
          <CameraToolbar
            onDeviceChange={setCurrentDevice}
            onFlashlightChange={setFlashlightOn}
            flashlightOn={flashlightOn}
          />
        </View>
        <View className="flex-1" />

        {/* thumbnails */}
        <View className=" px-6 py-4 bg-dark2/50 mb-4 relative">
          <BlurView intensity={10} tint="dark" className="absolute inset-0" />
          {item?.image && item?.image?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className=" w-full "
              contentContainerClassName=" flex-row gap-1 items-center"
            >
              {item.image.map((uri, index) => (
                <View key={`${uri}-${index}`} className="mr-3">
                  <AdditionalImageContainer uri={uri} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* capture button */}
        <View className="pb-20 flex items-center justify-center">
          <TouchableOpacity
            onPress={handleCapture}
            className="w-[70px] h-[70px] rounded-full"
          >
            <View className="flex-1 rounded-full border-4 border-white p-1">
              <View className="flex-1 rounded-full bg-white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddAdditionalImages;
