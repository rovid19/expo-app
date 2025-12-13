import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useEffect, useRef, useState } from "react";
import Svg, { Rect, Mask, Defs, Path } from "react-native-svg";
import apiClient from "../../../lib/axios";
import ScannedItemContainer from "../../../components/scan/scannedItemContainer";
import { useItemsStore } from "../../../stores/itemsStore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CUTOUT_WIDTH = 350;
const CUTOUT_HEIGHT = 600;

const R = 20;
const CORNER_LENGTH = 40;
const STROKE = 4;

const CUTOUT_X = (SCREEN_WIDTH - CUTOUT_WIDTH) / 2;
const CUTOUT_Y = (SCREEN_HEIGHT - CUTOUT_HEIGHT) / 2;

const BUTTON_SIZE = 70;
const BUTTON_X = SCREEN_WIDTH / 2;
const BUTTON_Y = CUTOUT_Y + CUTOUT_HEIGHT - 90;

export default function Scan() {
  const { scannedItems, containerIndex, addScannedItem, setContainerIndex } =
    useItemsStore();

  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current && scannedItems.length > 0) {
      const itemWidth = 250;
      const spacing = 12;
      const offset = containerIndex * (itemWidth + spacing);
      scrollViewRef.current.scrollTo({ x: offset, animated: true });
    }
  }, [containerIndex]);

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync();
      console.log(photo);

      const form = new FormData();
      form.append("file", {
        uri: photo.uri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const res = await apiClient.post("/scan/image-scan", form);

      addScannedItem(res.data.scannedItem);
      console.log(res.data.scannedItem);
    } catch (err) {
      console.error(err);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        enableTorch={flashlightOn}
      />

      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.flashlightButton}
          onPress={() => setFlashlightOn(!flashlightOn)}
        >
          <Text style={styles.flashlightIcon}>
            {flashlightOn ? "🔦" : "💡"}
          </Text>
        </TouchableOpacity>

        <Svg style={StyleSheet.absoluteFill}>
          {/* MASK */}
          <Defs>
            <Mask id="mask">
              <Rect width="100%" height="100%" fill="white" />
              <Rect
                x={CUTOUT_X}
                y={CUTOUT_Y}
                width={CUTOUT_WIDTH}
                height={CUTOUT_HEIGHT}
                rx={R}
                ry={R}
                fill="black"
              />
            </Mask>
          </Defs>

          {/* DARK AREA */}
          <Rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.6)"
            mask="url(#mask)"
          />

          {/* TOP-LEFT */}
          <Path
            d={`
              M ${CUTOUT_X} ${CUTOUT_Y + CORNER_LENGTH}
              L ${CUTOUT_X} ${CUTOUT_Y + R}
              Q ${CUTOUT_X} ${CUTOUT_Y} ${CUTOUT_X + R} ${CUTOUT_Y}
              L ${CUTOUT_X + CORNER_LENGTH} ${CUTOUT_Y}
            `}
            stroke="white"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />

          {/* TOP-RIGHT */}
          <Path
            d={`
              M ${CUTOUT_X + CUTOUT_WIDTH - CORNER_LENGTH} ${CUTOUT_Y}
              L ${CUTOUT_X + CUTOUT_WIDTH - R} ${CUTOUT_Y}
              Q ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y} ${
              CUTOUT_X + CUTOUT_WIDTH
            } ${CUTOUT_Y + R}
              L ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y + CORNER_LENGTH}
            `}
            stroke="white"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />

          {/* BOTTOM-LEFT */}
          <Path
            d={`
              M ${CUTOUT_X + CORNER_LENGTH} ${CUTOUT_Y + CUTOUT_HEIGHT}
              L ${CUTOUT_X + R} ${CUTOUT_Y + CUTOUT_HEIGHT}
              Q ${CUTOUT_X} ${CUTOUT_Y + CUTOUT_HEIGHT} ${CUTOUT_X} ${
              CUTOUT_Y + CUTOUT_HEIGHT - R
            }
              L ${CUTOUT_X} ${CUTOUT_Y + CUTOUT_HEIGHT - CORNER_LENGTH}
            `}
            stroke="white"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />

          {/* BOTTOM-RIGHT */}
          <Path
            d={`
              M ${CUTOUT_X + CUTOUT_WIDTH} ${
              CUTOUT_Y + CUTOUT_HEIGHT - CORNER_LENGTH
            }
              L ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y + CUTOUT_HEIGHT - R}
              Q ${CUTOUT_X + CUTOUT_WIDTH} ${CUTOUT_Y + CUTOUT_HEIGHT} ${
              CUTOUT_X + CUTOUT_WIDTH - R
            } ${CUTOUT_Y + CUTOUT_HEIGHT}
              L ${CUTOUT_X + CUTOUT_WIDTH - CORNER_LENGTH} ${
              CUTOUT_Y + CUTOUT_HEIGHT
            }
            `}
            stroke="white"
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />
        </Svg>

        {scannedItems.length > 0 && (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={262}
            decelerationRate="fast"
            contentContainerStyle={styles.scrollContent}
            onMomentumScrollEnd={(e) => {
              const offsetX = e.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / 262);
              setContainerIndex(index);
            }}
            style={[
              styles.scannedItemsContainer,
              {
                top: BUTTON_Y - BUTTON_SIZE / 2 - 120,
              },
            ]}
          >
            {scannedItems.map((item, index) => (
              <View
                key={`${item.detected_item}-${index}`}
                style={styles.itemWrapper}
              >
                <ScannedItemContainer item={item} index={index} />
              </View>
            ))}
          </ScrollView>
        )}

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
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "box-none",
  },
  scannedItemsContainer: {
    position: "absolute",
    width: SCREEN_WIDTH,
    height: 120,
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - 250) / 2,
    gap: 12,
  },
  itemWrapper: {
    marginRight: 12,
  },
  captureButton: {
    position: "absolute",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  captureButtonOuter: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: BUTTON_SIZE - 16,
    height: BUTTON_SIZE - 16,
    borderRadius: (BUTTON_SIZE - 16) / 2,
    backgroundColor: "white",
  },
  flashlightButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  flashlightIcon: {
    fontSize: 24,
  },
});
