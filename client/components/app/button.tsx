import React from "react";
import { TouchableOpacity, Text } from "react-native";
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
}

const Button = ({
  title,
  onPress,
  disabled,
  icon,
  backgroundColor,
  textColor,
  iconSize,
  padding,
}: ButtonProps) => {
  console.log(onPress);
  return (
    <TouchableOpacity
      onPress={() => {
        console.log("onPress");
        onPress();
      }}
      disabled={disabled}
      className={`${backgroundColor} rounded-full ${padding ? `p-${padding}` : "p-4"} w-full flex flex-row items-center justify-center gap-2`}
    >
      {icon && (
        <SvgXml
          xml={icon}
          width={iconSize}
          height={iconSize}
          color={textColor}
        />
      )}
      <Text className={`text-${textColor} font-bold text-lg`}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
