import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useEffect, useRef, useState, useCallback } from "react";
import * as MediaLibrary from "expo-media-library";
import { Camera, useCameraPermission } from "react-native-vision-camera";
import ScannedItemContainer from "../../../components/scan/scannedItemContainer";
import CameraToolbar from "../../../components/app/cameraToolbar";
import SvgScanOverlay from "../../../components/scan/svgScanOverlay";
import { useItems2Store } from "../../../stores/items2Store";
import { useFocusEffect } from "@react-navigation/native";
import useCapturePhoto from "../../../hooks/scan/useCapturePhoto";
import useCameraDevicesHook from "../../../hooks/scan/useCameraDevicesHook";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function Scan() {
  const { setItemType, scannedItems, selectedItemId, setSelectedItemId } =
    useItems2Store();
  const [startAni, setStartAni] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const { currentDevice, setCurrentDevice } = useCameraDevicesHook();
  const { flashlightOn, setFlashlightOn } = useCapturePhoto({ cameraRef });
  const { hasPermission, requestPermission } = useCameraPermission();
  const tabBarHeight = useBottomTabBarHeight();
  const { handleCapture } = useCapturePhoto({ cameraRef, setStartAni });

  const [mediaLibraryPermission, setMediaLibraryPermission] =
    useState<MediaLibrary.PermissionResponse | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      setItemType("scanned");
      return () => setItemType("listed");
    }, []),
  );

  useEffect(() => {
    if (!hasPermission) requestPermission();
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission({ status } as MediaLibrary.PermissionResponse);
    })();
  }, []);

  // animation when scanned item is added to the list
  useEffect(() => {
    if (scrollViewRef.current && scannedItems.length > 0) {
      const offset = scannedItems.length * (250 + 12);
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [scannedItems]);

  if (!currentDevice) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 ">
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={currentDevice}
        isActive={true}
        photo
        torch={flashlightOn ? "on" : "off"}
      />

      {/* Overlay */}
      <View
        style={{ paddingBottom: tabBarHeight + 33 }}
        className="absolute inset-0 pointer-events-box-none flex flex-col "
      >
        {/* Toolbar */}
        <View className=" z-20 w-full px-4 pt-16 h-30 items-center ">
          <CameraToolbar
            onDeviceChange={setCurrentDevice}
            onFlashlightChange={setFlashlightOn}
            flashlightOn={flashlightOn}
          />
        </View>
        <View className="flex-1" pointerEvents="box-none" />

        {/* SVG Overlay */}
        <View className="absolute inset-0">
          <SvgScanOverlay startAni={startAni} />
        </View>

        {/* Scanned items */}
        <View className=" px-6 py-4 mb-4 relative flex justify-center items-center h-[150px] w-full">
          {!startAni && scannedItems.length > 0 && (
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={262}
              decelerationRate="fast"
              contentContainerClassName="flex-row items-center gap-3"
            >
              {scannedItems.map((item, index) => (
                <View key={`${item.detected_item}-${index}`} className="mr-3">
                  <ScannedItemContainer item={item} index={index} />
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        <View className=" flex items-center justify-center pb-[64px]">
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
}
