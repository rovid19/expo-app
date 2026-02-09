import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { logo, logoWhite } from "../../assets/icons/icons";
import { useAppStore } from "../../stores/appStore";

const LaunchOpeningAnimation: React.FC = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const bgProgress = useSharedValue(0);

  const logoOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const textScale = useSharedValue(0);

  const [showText, setShowText] = useState(false);
  const [useWhiteLogo, setUseWhiteLogo] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  const { setLaunchOpeningAnimation } = useAppStore();

  const finish = () => {
    setLaunchOpeningAnimation(false);
  };

  const revealAccentPhase = () => {
    setUseWhiteLogo(true);
    setShowText(true);

    logoOpacity.value = withTiming(1, { duration: 1200 });

    textOpacity.value = withTiming(1, { duration: 200 });

    textScale.value = withTiming(1, {
      duration: 350,
      easing: Easing.out(Easing.cubic),
    });

    setTimeout(() => runOnJS(finish)(), 350);
  };

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.15, { duration: 500 }),
      withTiming(1, { duration: 400 })
    );

    rotate.value = withSequence(
      withTiming(-12, { duration: 500 }),
      withTiming(0, { duration: 400 })
    );

    logoOpacity.value = withDelay(
      800,
      withTiming(0, { duration: 200 })
    );

    bgProgress.value = withDelay(
      750,
      withTiming(1, { duration: 500 }, (ok) => {
        if (ok) runOnJS(revealAccentPhase)();
      })
    );
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgProgress.value === 0 ? "#0B0B0B" : "#0B0B0B",
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  // ⭐ Center compensation
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      {
        translateX: -(textWidth / 2) * (1 - textScale.value),
      },
      { scaleX: textScale.value },
    ],
  }));

  return (
    <Animated.View className="flex-1 justify-center items-center" style={bgStyle}>
      <View className="flex flex-row items-center justify-center gap-2">
       {!showText && <Animated.View style={logoStyle}>
          <SvgXml xml={useWhiteLogo ? logoWhite : logo} width={96} height={96} />
        </Animated.View>}

        {showText && (
          <Animated.Text
            onLayout={(e) => setTextWidth(e.nativeEvent.layout.width)}
            style={textStyle}
            className="text-white text-5xl font-bold"
          >
            Dexly
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );
};

export default LaunchOpeningAnimation;
