import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
} from "react-native-reanimated";

import { mascotLoadingDown, mascotLoadingUp } from "../../assets/icons/icons";

interface LoaderProps {
  text: string;
  textOptional?: string;
  dots?: boolean;
  size?: number;
}

const DOTS = ["", ".", "..", "..."];

const Loader = ({
  text,
  textOptional,
  dots = true,
  size = 64,
}: LoaderProps) => {
  const t = useSharedValue(0);
  const dot = useSharedValue(0);
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    t.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 300 }, () => {
          dot.value = (dot.value + 1) % DOTS.length;
          runOnJS(setDotIndex)(dot.value);
        }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      false
    );
  }, []);

  const upStyle = useAnimatedStyle(() => ({
    opacity: t.value,
    transform: [{ scale: 1 + t.value * 0.04 }],
  }));

  const downStyle = useAnimatedStyle(() => ({
    opacity: 1 - t.value,
    transform: [{ scale: 1 + (1 - t.value) * 0.04 }],
  }));

  const textPulseStyle = useAnimatedStyle(() => ({
    opacity: 0.6 + t.value * 0.4,
  }));

  return (
    <View className="flex-1 justify-center items-center gap-3">
      <View style={{ width: size, height: size }}>
        <Animated.View style={[{ position: "absolute", inset: 0 }, downStyle]}>
          <SvgXml xml={mascotLoadingDown} width={size} height={size} />
        </Animated.View>

        <Animated.View style={[{ position: "absolute", inset: 0 }, upStyle]}>
          <SvgXml xml={mascotLoadingUp} width={size} height={size} />
        </Animated.View>
      </View>

      <Animated.Text className="text-light2 text-base" style={textPulseStyle}>
        {text}
        {dots && DOTS[dotIndex]}
      </Animated.Text>

      {textOptional && (
        <Animated.Text className="text-light3 text-sm" style={textPulseStyle}>
          {textOptional}
        </Animated.Text>
      )}
    </View>
  );
};

export default Loader;
