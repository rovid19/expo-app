import React from "react";
import { Text, View } from "react-native";

const onboardingVideo = () => {
  return (
    <View className="flex-1 items-center justify-center pt-20 flex flex-col gap-8">
      <View className="w-full flex flex-col gap-2 items-center justify-center">
        <Text className="text-light2 font-bold text-4xl">Scan.</Text>
        <Text className="text-light2 font-bold text-4xl">
          Get real market value.
        </Text>
        <Text className="text-light2 font-bold text-4xl">Sell.</Text>
      </View>
      <View className="flex-1 w-full"></View>
    </View>
  );
};

export default onboardingVideo;
