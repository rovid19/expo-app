import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { homeOutline, scanOutline, userOutline } from "../assets/icons/icons";
import TabBarButton from "./tabBarButton";
import { useState, useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ height: 20, width: 100 });
  const buttonWidth = dimensions.width / state.routes.length;

  const icon = {
    "home/index": homeOutline,
    "scan/index": scanOutline,
    "profile/index": userOutline,
  };

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const tabPositionX = useSharedValue(0);

  // Update animation when route changes (including programmatic navigation)
  useEffect(() => {
    if (dimensions.width > 0 && state.routes.length > 0) {
      const buttonWidth = dimensions.width / state.routes.length;
      tabPositionX.value = withSpring(buttonWidth * state.index, {
        duration: 500,
      });
    }
  }, [state.index, dimensions.width, state.routes.length]);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: tabPositionX.value }] };
  });

  // Check if current route is scan tab
  const currentRoute = state.routes[state.index]?.name;
  const isScanTab = currentRoute === "scan/index";

  return (
    <View
      onLayout={onTabbarLayout}
      style={[styles.tabBar, isScanTab && { backgroundColor: "transparent" }]}
    >
      <AnimatedView
        className="bg-neutral-900 border border-white/10"
        style={[
          animatedStyle,
          {
            position: "absolute",

            borderRadius: 30,
            marginHorizontal: 12,
            height: dimensions.height - 15,
            width: buttonWidth - 25,
          },
        ]}
      />
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          tabPositionX.value = withSpring(buttonWidth * index, {
            duration: 500,
          });
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            route={route}
            icon={icon[route.name as keyof typeof icon]}
            onPress={onPress}
            onLongPress={onLongPress}
            label={label}
            color={isFocused ? "#FFF" : "#222"}
            isFocused={isFocused}
            hideText={isScanTab}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});
