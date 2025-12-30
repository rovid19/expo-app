import { Pressable, StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useEffect } from "react";

const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedView = Animated.createAnimatedComponent(View);

interface TabBarButtonProps {
  onPress: () => void;
  onLongPress: () => void;
  route: any;
  icon: any;
  label: string;
  color: string;
  isFocused: boolean;
  hideText: boolean;
}

const TabBarButton = ({
  onPress,
  onLongPress,
  route,
  icon,
  label,
  color,
  isFocused,
  hideText,
}: TabBarButtonProps) => {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0, { duration: 350 });
  }, [isFocused, scale]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    const top = interpolate(scale.value, [0, 1], [0, 9]);
    return { transform: [{ scale: scaleValue }], top };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const baseOpacity = interpolate(scale.value, [0, 1], [1, 0]);
    // If hideText is true, force opacity to 0, otherwise use the animated opacity
    const opacity = hideText ? 0 : baseOpacity;
    return { opacity };
  });

  console.log("hideText", hideText);
  return (
    <Pressable
      key={route.name}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabBarItem}
    >
      <AnimatedView style={animatedIconStyle}>
        {icon && (
          <SvgXml
            xml={icon}
            width={24}
            height={24}
            color={
              (hideText && route.name === "home/index") ||
              (hideText && route.name === "profile/index")
                ? "#E5E5E5"
                : color
            }
          />
        )}
      </AnimatedView>

      <AnimatedText style={animatedTextStyle} className="text-sm">
        {label}
      </AnimatedText>
    </Pressable>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  tabBarItem: {
    flex: 1,
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
