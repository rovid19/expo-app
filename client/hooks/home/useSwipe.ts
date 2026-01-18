import { Dimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  useSharedValue,
  withTiming,
  Easing,
  interpolateColor,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const COMMIT_RATIO = 0.3;

export function useSwipePager(
  setCurrentTab: (t: "overview" | "collection") => void
) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const startPage = useSharedValue<"overview" | "collection">("overview");
  const overviewOpacity = useSharedValue(1);
  const collectionOpacity = useSharedValue(0);
  const hasIntent = useSharedValue(false);

  const overviewStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const collectionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value + width }],
  }));

  const overviewBgStyle = useAnimatedStyle(() => ({
    opacity: overviewOpacity.value,
  }));

  const collectionBgStyle = useAnimatedStyle(() => ({
    opacity: collectionOpacity.value,
  }));

  const overviewTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      overviewOpacity.value,
      [0, 1],
      ["#9CA3AF", "#EDF2F7"] // light3 → light2
    ),
  }));

  const collectionTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      collectionOpacity.value,
      [0, 1],
      ["#9CA3AF", "#EDF2F7"]
    ),
  }));

  // helper function to run animation on press
  const goToTab = (next: "overview" | "collection") => {
    "worklet";

    translateX.value = withTiming(next === "collection" ? -width : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });

    if (next === "overview") {
      overviewOpacity.value = withTiming(1, { duration: 180 });
      collectionOpacity.value = 0;
    } else {
      collectionOpacity.value = withTiming(1, { duration: 180 });
      overviewOpacity.value = 0;
    }
  };

  const goToTabJS = (next: "overview" | "collection") => {
    goToTab(next);
    runOnJS(setCurrentTab)(next);
  };

  const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-20, 20])
    .onBegin(() => {
      startX.value = translateX.value;
      startPage.value = translateX.value === 0 ? "overview" : "collection";
      hasIntent.value = false;
    })

    .onUpdate((e) => {
      // 🔒 intent gate: only after real horizontal movement
      if (!hasIntent.value && Math.abs(e.translationX) > 12) {
        hasIntent.value = true;

        if (startPage.value === "overview") {
          overviewOpacity.value = withTiming(0, { duration: 150 });
        } else {
          collectionOpacity.value = withTiming(0, { duration: 150 });
        }
      }

      translateX.value = Math.max(
        -width,
        Math.min(0, startX.value + e.translationX)
      );
    })

    .onEnd((e) => {
      let next: "overview" | "collection" = startPage.value;

      if (
        startPage.value === "overview" &&
        (translateX.value < -width * COMMIT_RATIO || e.velocityX < -500)
      ) {
        next = "collection";
      }

      if (
        startPage.value === "collection" &&
        (translateX.value > -width * (1 - COMMIT_RATIO) || e.velocityX > 500)
      ) {
        next = "overview";
      }

      // 🔑 single source of truth for commit animation
      goToTab(next);

      // 🔑 JS state update (thread-safe)
      runOnJS(setCurrentTab)(next);
    });

  return {
    translateX,
    overviewOpacity,
    collectionOpacity,
    swipeGesture,
    overviewStyle,
    collectionStyle,
    overviewBgStyle,
    collectionBgStyle,
    overviewTextStyle,
    collectionTextStyle,
    goToTab: goToTabJS,
  };
}
