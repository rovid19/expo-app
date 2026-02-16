import React from "react";
import {
  TouchableOpacity,
  Text,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SvgXml } from "react-native-svg";

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: string;
  backgroundColor?: string;
  textColor?: string;
  iconSize?: number;
  padding?: number;
  animation?: boolean;
  animationText?: string;
  iconColor?: string;
  bold?: boolean;
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Button = ({
  title,
  onPress,
  disabled,
  icon,
  backgroundColor,
  textColor,
  iconSize,
  padding,
  animation,
  animationText,
  iconColor,
  bold = true,
}: ButtonProps) => {
  const loadingAnim = React.useRef(new Animated.Value(0)).current;
  const loadingLoopRef = React.useRef<Animated.CompositeAnimation | null>(null);

  const isLoading = Boolean(animation);

  React.useEffect(() => {
    loadingLoopRef.current?.stop();
    loadingLoopRef.current = null;

    if (!isLoading) {
      loadingAnim.setValue(0);
      return;
    }

    loadingAnim.setValue(0);

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    loadingLoopRef.current = loop;
    loop.start();

    return () => {
      loadingLoopRef.current?.stop();
      loadingLoopRef.current = null;
    };
  }, [isLoading, loadingAnim]);

  const animatedStyle = React.useMemo(() => {
    if (!isLoading) return undefined;

    const scale = loadingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.97],
    });

    const opacity = loadingAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.6],
    });

    return { transform: [{ scale }], opacity };
  }, [isLoading, loadingAnim]);

  return (
    <AnimatedTouchableOpacity
      onPress={isLoading ? undefined : onPress}
      disabled={disabled || isLoading}
      style={animatedStyle}
      className={`${backgroundColor} rounded-full ${padding ? `p-${padding}` : "p-4"} w-full flex flex-row items-center justify-center gap-2 ${disabled && "opacity-50"}`}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        icon && (
          <SvgXml
            xml={icon}
            width={iconSize}
            height={iconSize}
            color={iconColor && iconColor}
          />
        )
      )}
      <Text
        className={`text-${textColor} ${bold ? "font-bold" : "font-sans"} text-lg`}
      >
        {animation && animationText ? animationText : title}
      </Text>
    </AnimatedTouchableOpacity>
  );
};

export default Button;
