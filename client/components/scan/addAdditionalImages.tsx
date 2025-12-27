import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useItemsStore } from "../../stores/itemsStore";
import AdditionalImageContainer from "./additionalImageContainer";
import CameraToolbar from "../cameraToolbar";
import {
  Camera,
  CameraDevice,
  useCameraDevices,
  useCameraPermission,
} from "react-native-vision-camera";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BUTTON_SIZE = 70;
const BUTTON_X = SCREEN_WIDTH / 2;
const BUTTON_Y = SCREEN_HEIGHT - 120;

interface AddAdditionalImagesProps {
  onClose: () => void;
}

const AddAdditionalImages: React.FC<AddAdditionalImagesProps> = ({
  onClose,
}) => {
  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef<Camera>(null);
  const { selectedScannedItem, addPhoto, removePhoto } = useItemsStore();
  const devices = useCameraDevices();

  // Get back devices and find normal (wide-angle) lens as default
  const backDevices = Array.isArray(devices)
    ? devices.filter((d) => d.position === "back")
    : (devices as any)?.back
    ? [(devices as any).back]
    : [];

  const normalDeviceIndex = backDevices.findIndex((d) =>
    (d.physicalDevices ?? []).includes("wide-angle-camera" as any)
  );
  const defaultDevice =
    normalDeviceIndex >= 0 ? backDevices[normalDeviceIndex] : backDevices[0];

  const [currentDevice, setCurrentDevice] = useState<CameraDevice | undefined>(
    defaultDevice
  );

  const handleCapture = async () => {
    if (!cameraRef.current || !currentDevice) return;
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: flashlightOn ? "on" : "off",
      });
      addPhoto(`file://${photo.path}`);
      console.log("Additional photo captured:", photo);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, []);

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentDevice) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        device={currentDevice}
        isActive={true}
        photo={true}
      />
      <View style={styles.overlay}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Flashlight toggle */}
        <CameraToolbar
          onDeviceChange={setCurrentDevice}
          onFlashlightChange={setFlashlightOn}
        />

        {/* Additional photos list */}
        {selectedScannedItem &&
          selectedScannedItem.image &&
          selectedScannedItem.image.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosScrollContent}
              style={[
                styles.photosContainer,
                {
                  top: BUTTON_Y - BUTTON_SIZE / 2 - 120,
                },
              ]}
            >
              {selectedScannedItem.image?.map((uri, index) => (
                <View key={`${uri}-${index}`} style={styles.photoWrapper}>
                  <AdditionalImageContainer uri={uri} />
                </View>
              ))}
            </ScrollView>
          )}

        {/* Capture button */}
        <TouchableOpacity
          style={[
            styles.captureButton,
            {
              left: BUTTON_X - BUTTON_SIZE / 2,
              top: BUTTON_Y - BUTTON_SIZE / 2,
            },
          ]}
          onPress={handleCapture}
        >
          <View style={styles.captureButtonOuter}>
            <View style={styles.captureButtonInner} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "box-none",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  closeText: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "300",
  },
  flashlightButton: {
    position: "absolute",
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  flashlightIcon: {
    fontSize: 24,
  },
  captureButton: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  captureButtonOuter: {
    flex: 1,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#FFF",
    padding: 4,
  },
  captureButtonInner: {
    flex: 1,
    borderRadius: 28,
    backgroundColor: "#FFF",
  },
  message: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: "#A3E635",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  permissionButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "600",
  },
  photosContainer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 120,
  },
  photosScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  photoWrapper: {
    marginRight: 12,
  },
});

export default AddAdditionalImages;
