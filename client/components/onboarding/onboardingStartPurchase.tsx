import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { check } from "../../assets/icons/icons";
import Button from "../app/button";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { useEffect, useRef } from "react";
import { ResizeMode, Video } from "expo-av";

const OnboardingStartPurchase = () => {
  const { setOnboardingStep, onboardingStep } = useOnboardingStore();
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      videoRef.current?.playAsync().catch(() => {});
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 items-center flex flex-col gap-8 pt-28">
      <View className="flex flex-col gap-2 items-center justify-center">
        <Text className="text-light2 font-bold text-4xl">We want you to</Text>
        <Text className="text-light2 font-bold text-4xl">
          try Dexly for free
        </Text>
      </View>

      <View className="flex-1 w-full">
        <Video
          ref={videoRef}
          source={require("../../assets/AppVideo.mp4")}
          style={{ width: "100%", height: "100%", borderRadius: 20 }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          isMuted
          onLoad={() => videoRef.current?.playAsync().catch(() => {})}
          progressUpdateIntervalMillis={16}
        />
      </View>

      <View className="w-full flex flex-col gap-2 items-center justify-center pb-12">
        <View className="w-full flex flex-row gap-2 items-center justify-center">
          <SvgXml xml={check} width={24} height={24} color="#00FF00" />
          <Text className="text-light2 font-bold text-xl">
            No Payment Due Now
          </Text>
        </View>

        <Button
          title={"Try for $0.00"}
          onPress={() => {
            setOnboardingStep(onboardingStep + 1);
          }}
          iconSize={24}
          backgroundColor="bg-accent1"
          textColor="text-dark1"
          padding={6}
        />

        <Text className="text-light3 font-bold text-base">
          3 days free, then $34,99 per year (2,91 $/mo)
        </Text>
      </View>
    </View>
  );
};

export default OnboardingStartPurchase;
