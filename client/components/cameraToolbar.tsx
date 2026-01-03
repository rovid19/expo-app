import { View, TouchableOpacity } from "react-native";
import { useEffect, useState, useMemo } from "react";
import {
  useCameraDevices,
  type CameraDevice,
} from "react-native-vision-camera";
import { SvgXml } from "react-native-svg";
import {
  leftArrow,
  flashlightOff,
  flashlightOn as flashlightOnIcon,
  zoomIn,
  zoomOut,
  settings,
} from "../assets/icons/icons";
import { BlurView } from "expo-blur";

interface CameraToolbarProps {
  onDeviceChange: (device: CameraDevice | undefined) => void;
  onFlashlightChange: (on: boolean) => void;
}

const CameraToolbar = ({
  onDeviceChange,
  onFlashlightChange,
}: CameraToolbarProps) => {
  // Camera index: 0 = wide, 1 = normal (default), 2 = telephoto
  const [expandToolbar, setExpandToolbar] = useState<boolean>(false);
  const [cameraIndex, setCameraIndex] = useState<number>(1);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const devices = useCameraDevices();

  // Get all back devices
  const backDevices: CameraDevice[] = useMemo(() => {
    return Array.isArray(devices)
      ? devices.filter((d) => d.position === "back")
      : (devices as any)?.back
      ? [(devices as any).back as CameraDevice]
      : [];
  }, [devices]);

  // Find specific lens devices (prioritize single-lens devices)
  const wideDevice = useMemo(
    () =>
      backDevices.find(
        (d) =>
          d.physicalDevices?.length === 1 &&
          d.physicalDevices[0] === "ultra-wide-angle-camera"
      ),
    [backDevices]
  );
  const normalDevice = useMemo(
    () =>
      backDevices.find(
        (d) =>
          d.physicalDevices?.length === 1 &&
          d.physicalDevices[0] === "wide-angle-camera"
      ),
    [backDevices]
  );
  const telephotoDevice = useMemo(
    () =>
      backDevices.find(
        (d) =>
          d.physicalDevices?.length === 1 &&
          d.physicalDevices[0] === "telephoto-camera"
      ),
    [backDevices]
  );

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

  // Determine current lens name for badge based on index
  const getLensName = (): string => {
    if (cameraIndex === 0) return "Wide";
    if (cameraIndex === 1) return "Normal";
    if (cameraIndex === 2) return "Telephoto";
    return "Camera";
  };

  return (
    <TouchableOpacity
      className="self-start bg-neutral-900/90 w-fit p-3 rounded-full flex flex-row items-center gap-8 border border-white/10"
      onPress={() => setExpandToolbar(!expandToolbar)}
    >
      <SvgXml
        xml={expandToolbar ? leftArrow : settings}
        width={24}
        height={24}
        color="white"
      />
      {expandToolbar && (
        <View className="flex flex-row gap-4">
          <TouchableOpacity onPress={() => setFlashlightOn(!flashlightOn)}>
            <SvgXml
              xml={flashlightOn ? flashlightOnIcon : flashlightOff}
              width={28}
              height={28}
              color="white"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePreviousLens()}>
            <SvgXml xml={zoomOut} width={28} height={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNextLens()}>
            <SvgXml xml={zoomIn} width={28} height={28} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CameraToolbar;
