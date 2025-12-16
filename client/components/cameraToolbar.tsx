import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import {
  useCameraDevices,
  type CameraDevice,
} from "react-native-vision-camera";

interface CameraToolbarProps {
  onDeviceChange: (device: CameraDevice | undefined) => void;
  onFlashlightChange: (on: boolean) => void;
}

const CameraToolbar = ({
  onDeviceChange,
  onFlashlightChange,
}: CameraToolbarProps) => {
  // Camera index: 0 = wide, 1 = normal (default), 2 = telephoto
  const [cameraIndex, setCameraIndex] = useState<number>(1);
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const devices = useCameraDevices();

  // Get all back devices
  const backDevices: CameraDevice[] = Array.isArray(devices)
    ? devices.filter((d) => d.position === "back")
    : (devices as any)?.back
    ? [(devices as any).back as CameraDevice]
    : [];

  // Find specific lens devices (prioritize single-lens devices)
  const wideDevice = backDevices.find(
    (d) =>
      d.physicalDevices?.length === 1 &&
      d.physicalDevices[0] === "ultra-wide-angle-camera"
  );
  const normalDevice = backDevices.find(
    (d) =>
      d.physicalDevices?.length === 1 &&
      d.physicalDevices[0] === "wide-angle-camera"
  );
  const telephotoDevice = backDevices.find(
    (d) =>
      d.physicalDevices?.length === 1 &&
      d.physicalDevices[0] === "telephoto-camera"
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
    backDevices.length,
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
    <View style={styles.container}>
      <TouchableOpacity style={styles.zoomButton} onPress={handlePreviousLens}>
        <Text style={styles.zoomButtonText}>-</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.flashlightButton}
        onPress={() => setFlashlightOn(!flashlightOn)}
      >
        <Text style={styles.flashlightIcon}>{flashlightOn ? "🔦" : "💡"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.zoomButton} onPress={handleNextLens}>
        <Text style={styles.zoomButtonText}>+</Text>
      </TouchableOpacity>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>{getLensName()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  zoomButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  flashlightButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashlightIcon: {
    fontSize: 24,
  },
  badge: {
    marginLeft: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default CameraToolbar;
