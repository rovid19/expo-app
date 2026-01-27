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

    return { transform: [{ scale: scaleValue }] };
  });

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
            width={isFocused ? 24 : 24}
            height={isFocused ? 24 : 24}
            color={
              (hideText && route.name === "home/index") ||
              (hideText && route.name === "profile/index")
                ? "#E5E5E5"
                : color
            }
          />
        )}
      </AnimatedView>
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
    paddingVertical: 8,
  },
});
