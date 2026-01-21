import { View, Pressable, Text } from "react-native";
import { useEffect, useState } from "react";
import { type CameraDevice } from "react-native-vision-camera";
import { SvgXml } from "react-native-svg";
import {
  leftArrow,
  flashlightOff,
  flashlightOn as flashlightOnIcon,
  zoomIn,
  zoomOut,
  logo,
} from "../assets/icons/icons";
import { BlurView } from "expo-blur";
import * as ExpoRouter from "expo-router";
import useCameraDevicesHook from "../hooks/useCameraDevicesHook";
import { useListingDetailsStore } from "../stores/listingDetailsStore";

interface CameraToolbarProps {
  onDeviceChange: (device: CameraDevice | undefined) => void;
  onFlashlightChange: (on: boolean) => void;
}

const CameraToolbar = ({
  onDeviceChange,
  onFlashlightChange,
}: CameraToolbarProps) => {
  const [cameraIndex, setCameraIndex] = useState<number>(1);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const { backDevices, wideDevice, normalDevice, telephotoDevice } =
    useCameraDevicesHook();
  const {
    isAdditionalPhotosModalVisible,
    setIsAdditionalPhotosModalVisible,
    setIsEditListingModalVisible,
  } = useListingDetailsStore();

  // When cameraIndex changes, update the device
  useEffect(() => {
    let device: CameraDevice | undefined;

    if (cameraIndex === 0) {
      // Wide lens
      device = wideDevice || backDevices[0];
    } else if (cameraIndex === 1) {
      // Normal lens
      device = normalDevice || backDevices[0];
    } else if (cameraIndex === 2) {
      // Telephoto lens
      device = telephotoDevice || backDevices[backDevices.length - 1];
    }

    if (device) {
      onDeviceChange(device);
    }
  }, [
    cameraIndex,
    wideDevice,
    normalDevice,
    telephotoDevice,
    backDevices,
    onDeviceChange,
  ]);

  // Notify parent of flashlight change
  useEffect(() => {
    onFlashlightChange(flashlightOn);
  }, [flashlightOn, onFlashlightChange]);

  const handleNextLens = () => {
    // Plus: move to next lens (0 → 1 → 2)
    if (cameraIndex < 2) {
      setCameraIndex(cameraIndex + 1);
    }
  };

  const handlePreviousLens = () => {
    // Minus: move to previous lens (2 → 1 → 0)
    if (cameraIndex > 0) {
      setCameraIndex(cameraIndex - 1);
    }
  };

  return (
    <View className="w-full flex flex-row rounded-3xl overflow-hidden relative justify-between">
      <BlurView intensity={10} tint="dark" className="absolute inset-0" />
      <View className="rounded-3xl overflow-hidden bg-dark2/50 py-2 px-4 flex flex-row items-center gap-2 border border-dark3/50 relative">
        <BlurView intensity={10} tint="dark" className="absolute inset-0" />
        <Pressable
          className="p-2"
          onPress={() => {
            if (isAdditionalPhotosModalVisible) {
              setIsAdditionalPhotosModalVisible(false);
              setIsEditListingModalVisible(true);
            } else {
              ExpoRouter.router.back();
            }
          }}
        >
          <SvgXml xml={leftArrow} width={24} height={24} color="white" />
        </Pressable>
        <Pressable
          className="p-2"
          onPress={() => setFlashlightOn(!flashlightOn)}
        >
          <SvgXml
            xml={flashlightOn ? flashlightOnIcon : flashlightOff}
            width={24}
            height={24}
            color="white"
          />
        </Pressable>
      </View>
      <View className="flex flex-row items-center gap-2">
        <SvgXml xml={logo} width={32} height={32} color="white" />
        <Text className="text-light2 font-bold text-md">Dexly</Text>
      </View>
      <View className="rounded-3xl overflow-hidden bg-dark2/50 py-2 px-4 flex flex-row items-center gap-2 border border-dark3/50 relative">
        <BlurView intensity={10} tint="dark" className="absolute inset-0" />
        <Pressable className="p-2" onPress={() => handlePreviousLens()}>
          <SvgXml xml={zoomOut} width={24} height={24} color="white" />
        </Pressable>
        <Pressable className="p-2" onPress={() => handleNextLens()}>
          <SvgXml xml={zoomIn} width={24} height={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
};

export default CameraToolbar;
