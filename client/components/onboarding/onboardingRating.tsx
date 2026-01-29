import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import { SvgXml } from "react-native-svg";
import { star } from "../../assets/icons/icons";

const CARD_WIDTH = 260;
const GAP = 16;

const reviews = [
  {
    id: 1,
    text: "Lorem ipsum dolor sit amet consectetur adipiscing elit.",
    name: "John Doe",
  },
  {
    id: 2,
    text: "Sit amet consectetur adipiscing elit quisque faucibus ex.",
    name: "Jane Doe",
  },
  {
    id: 3,
    text: "Adipiscing elit quisque faucibus ex sapien vitae pellentesque.",
    name: "Alex Doe",
  },
];

const ReviewCard = () => (
  <View
    style={{ width: CARD_WIDTH }}
    className="bg-dark2 p-4 rounded-3xl flex flex-col gap-4"
  >
    <View className="flex flex-row gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <SvgXml key={i} xml={star} width={16} height={16} color={"#FFD700"} />
      ))}
    </View>
    <Text className="text-light3 font-sans text-base">
      Lorem ipsum dolor sit amet consectetur adipiscing elit.
    </Text>
    <Text className="text-light2 font-sans text-base">John Doe</Text>
  </View>
);

const AnimatedRow = ({ duration }: { duration: number }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const rowWidth = (CARD_WIDTH + GAP) * reviews.length;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -rowWidth,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX }] }} className="flex-row">
      {[...reviews, ...reviews].map((_, i) => (
        <View key={i} style={{ marginRight: GAP }}>
          <ReviewCard />
        </View>
      ))}
    </Animated.View>
  );
};

const OnboardingRating = () => {
  return (
    <View className="flex-1 pt-28 gap-8">
      <Text className="text-light2 font-bold text-4xl text-center">
        Help us grow
      </Text>

      <View className="items-center gap-2">
        <Image
          source={require("../../assets/logoWithBg.png")}
          className="w-[64px] h-[64px]"
        />
        <Text className="text-light2 font-bold text-xl">Dexly</Text>
      </View>

      <View className="overflow-hidden gap-6 mt-6">
        <AnimatedRow duration={22000} />
        <AnimatedRow duration={26000} />
      </View>
    </View>
  );
};

export default OnboardingRating;
