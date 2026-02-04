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

  const [showText, setShowText] = useState(false);
  const [useWhiteLogo, setUseWhiteLogo] = useState(false);

  const { setLaunchOpeningAnimation } = useAppStore();

  const finish = () => {
    setLaunchOpeningAnimation(false);
  };

  const revealAccentPhase = () => {
    setUseWhiteLogo(true);
    setShowText(true);

    // Logo fades back in on accent background
    logoOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });

    // Text fades in (no slide)
    textOpacity.value = withTiming(1, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });

    // End slightly after last fade
    setTimeout(() => {
      runOnJS(finish)();
    }, 350);
  };

  useEffect(() => {
    // Scale + rotate intro
    scale.value = withSequence(
      withTiming(1.15, { duration: 500, easing: Easing.out(Easing.ease) }),
      withTiming(1, { duration: 400 })
    );

    rotate.value = withSequence(
      withTiming(-12, { duration: 500 }),
      withTiming(0, { duration: 400 })
    );

    // Fade logo OUT near the end of the intro motion
    logoOpacity.value = withDelay(
      800,
      withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) })
    );

    // Background to accent, then fade logo/text back in
    bgProgress.value = withDelay(
      750,
      withTiming(1, { duration: 500 }, (ok) => {
        if (ok) runOnJS(revealAccentPhase)();
      })
    );
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: bgProgress.value === 0 ? "#0B0B0B" : "#83BD0F",
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  return (
    <Animated.View className="flex-1 justify-center items-center" style={bgStyle}>
      <View className="flex flex-row items-center justify-center gap-4">
        <Animated.View style={logoStyle}>
          <SvgXml
            xml={useWhiteLogo ? logoWhite : logo}
            width={96}
            height={96}
          />
        </Animated.View>

        {showText && (
          <Animated.Text
            style={textStyle}
            className="text-white text-4xl font-bold"
          >
            Dexly
          </Animated.Text>
        )}
      </View>
    </Animated.View>
  );
};

export default LaunchOpeningAnimation;
