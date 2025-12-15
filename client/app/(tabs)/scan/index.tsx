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
import * as MediaLibrary from "expo-media-library";
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

// Zoom presets: 0 = wide, mid = normal, high = closer
const ZOOM_LEVELS = [0, 0.3, 0.7];

export default function Scan() {
  const { scannedItems, containerIndex, addScannedItem, setContainerIndex } =
    useItemsStore();

  const [flashlightOn, setFlashlightOn] = useState<boolean>(false);
  const [zoomIndex, setZoomIndex] = useState<number>(1); // 0: wide, 1: normal, 2: closer
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, setMediaLibraryPermission] =
    useState<MediaLibrary.PermissionResponse | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();

    // Request media library permission
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaLibraryPermission({ status } as MediaLibrary.PermissionResponse);
    })();
  }, []);

  const handleZoomIn = () => {
    setZoomIndex((prev) => Math.min(ZOOM_LEVELS.length - 1, prev + 1));
  };

  const handleZoomOut = () => {
    setZoomIndex((prev) => Math.max(0, prev - 1));
  };

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

      // Create album and save photo
      if (
        mediaLibraryPermission?.status === "granted" &&
        res.data.scannedItem.detected_item
      ) {
        try {
          const albumName = res.data.scannedItem.detected_item;

          // Check if album exists, if not create it
          const albums = await MediaLibrary.getAlbumsAsync();
          let album = albums.find((a) => a.title === albumName);

          if (!album) {
            album = await MediaLibrary.createAlbumAsync(albumName);
          }

          // Save photo to the album
          if (album) {
            const asset = await MediaLibrary.createAssetAsync(photo.uri);
            await MediaLibrary.addAssetsToAlbumAsync(
              [asset.id],
              album.id,
              false
            );
          }
        } catch (albumError) {
          console.error("Error creating album or saving photo:", albumError);
        }
      }
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
        zoom={ZOOM_LEVELS[zoomIndex]}
      />

      <View style={styles.overlay}>
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
            <Text style={styles.zoomButtonText}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.flashlightButton}
            onPress={() => setFlashlightOn(!flashlightOn)}
          >
            <Text style={styles.flashlightIcon}>
              {flashlightOn ? "🔦" : "💡"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Text style={styles.zoomButtonText}>+</Text>
          </TouchableOpacity>
        </View>

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
  topControls: {
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
    zIndex: 10,
  },
  flashlightIcon: {
    fontSize: 24,
  },
});
