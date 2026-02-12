import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import { Video, ResizeMode } from "expo-av";

const onboardingVideo = () => {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      videoRef.current?.playAsync().catch(() => {});
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center justify-center pt-20 flex flex-col gap-8">
      <View className="w-full flex flex-col gap-2 items-center justify-center">
        <Text className="text-light2 font-bold text-4xl">Scan.</Text>
        <Text className="text-light2 font-bold text-4xl">
          Get real market value.
        </Text>
        <Text className="text-light2 font-bold text-4xl">Sell.</Text>
      </View>
      <View className="flex-1 w-full">
        <Video
          ref={videoRef}
          source={require("../../assets/Test.mp4")}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          isMuted
          onLoad={() => videoRef.current?.playAsync().catch(() => {})}
          progressUpdateIntervalMillis={16}
        />
      </View>
    </View>
  );
};

export default onboardingVideo;
