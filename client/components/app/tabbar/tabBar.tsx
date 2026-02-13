import { View, StyleSheet, LayoutChangeEvent } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  homeOutline,
  scanOutline,
  userOutline,
} from "../../../assets/icons/icons";
import TabBarButton from "./tabBarButton";
import { useState, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAppStore } from "../../../stores/appStore";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { hideNavbar } = useAppStore();

  const icon = {
    "home/index": homeOutline,
    "scan/index": scanOutline,
    "profile/index": userOutline,
  };

  const [dimensions, setDimensions] = useState({ height: 0, width: 0 });

  const onPillLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const buttonWidth =
    dimensions.width > 0 ? dimensions.width / state.routes.length : 0;

  const tabPositionX = useSharedValue(0);

  useEffect(() => {
    if (buttonWidth > 0) {
      tabPositionX.value = withTiming(buttonWidth * state.index, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [state.index, buttonWidth]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tabPositionX.value }],
  }));

  const currentRoute = state.routes[state.index]?.name;
  const isScanTab = currentRoute === "scan/index";

  if (hideNavbar) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 h-32 w-full flex items-center justify-center px-8 pb-12">
      <View
        onLayout={onPillLayout}
        className={`relative py-6 w-full flex flex-row items-center justify-between ${
          isScanTab ? "bg-dark2/80" : "bg-dark2/50"
        } border border-dark3/50 rounded-full overflow-hidden`}
      >
        <AnimatedView
          className={isScanTab ? "bg-accent1" : "bg-dark2"}
          style={[
            animatedStyle,
            {
              position: "absolute",
              left: 0,
              marginHorizontal: 12,
              height: dimensions.height - 15,
              width: buttonWidth - 25,
              borderRadius: 50,
            },
          ]}
        />

        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            tabPositionX.value = withTiming(buttonWidth * index, {
              duration: 200,
              easing: Easing.out(Easing.cubic),
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

          return (
            <TabBarButton
              key={route.name}
              route={route}
              icon={icon[route.name as keyof typeof icon]}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: "tabLongPress", target: route.key })
              }
              label={label}
              color={isFocused ? "#E6E6E6" : "#999999"}
              isFocused={isFocused}
              hideText={isScanTab}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
