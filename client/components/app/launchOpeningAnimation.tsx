import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import { logo } from "../../assets/icons/icons";
import { useAppStore } from "../../stores/appStore";

const LaunchOpeningAnimation: React.FC = () => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const logoOpacity = useSharedValue(1);

  const { setLaunchOpeningAnimation } = useAppStore();

  const finish = () => {
    setLaunchOpeningAnimation(false);
  };

  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.15, { duration: 500 }),
      withTiming(1, { duration: 400 }),
    );

    rotate.value = withSequence(
      withTiming(-12, { duration: 500 }),
      withTiming(0, { duration: 400 }),
    );

    logoOpacity.value = withDelay(
      800,
      withTiming(0, { duration: 200 }, (ok) => {
        if (ok) runOnJS(finish)();
      }),
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: "#0B0B0B" }}
    >
      <View className="flex flex-row items-center justify-center gap-2">
        <Animated.View style={logoStyle}>
          <SvgXml xml={logo} width={96} height={96} />
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default LaunchOpeningAnimation;
