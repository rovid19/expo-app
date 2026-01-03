import React from "react";
import { View, Text } from "react-native";
import colors from "tailwindcss/colors";
import { ActivityIndicator } from "react-native";
interface loaderProps {
  text: string;
  textOptional?: string;
}

const loader = ({ text, textOptional }: loaderProps) => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 flex-1 justify-center items-center bg-black/50">
      <View className="bg-white rounded-lg py-4 px-8 flex flex-col items-center justify-center">
        <ActivityIndicator size="small" color={colors.neutral[900]} />
        <Text className="text-neutral-900 text-lg font-medium mt-2">
          {text}
        </Text>
        {textOptional && (
          <Text className="text-neutral-900 text-sm font-medium">
            {textOptional}
          </Text>
        )}
      </View>
    </View>
  );
};

export default loader;
