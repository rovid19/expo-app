import { useEffect, useRef } from "react";
import { View, Text, Image, Animated, Easing } from "react-native";
import { SvgXml } from "react-native-svg";
import { star } from "../../assets/icons/icons";

const CARD_WIDTH = 260;
const GAP = 16;

const reviews = [
  {
    id: 1,
    text: "I use this in thrift stores to check resale value. Seeing real eBay prices helps me avoid bad buys. Fast and reliable.",
    name: "Megan Caldwell",
  },
  {
    id: 2,
    text: "I resell full time, and the eBay pricing is accurate. Profit and inventory tracking keep my margins clear. Part of my daily workflow.",
    name: "Brandon Whitaker",
  },
  {
    id: 3,
    text: "I sell items I don’t use anymore. The app identifies them quickly and shows real comps. Pricing is simple and stress-free.",
    name: "Allison Harper",
  },
];

const ReviewCard = ({ text, name }: { text: string; name: string }) => (
  <View
    style={{ width: CARD_WIDTH }}
    className="bg-dark2 p-4 rounded-3xl flex flex-col gap-4"
  >
    <View className="flex flex-row gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <SvgXml key={i} xml={star} width={16} height={16} color={"#FFD700"} />
      ))}
    </View>
    <Text className="text-light3 font-sans text-base">{text}</Text>
    <Text className="text-light2 font-sans text-base">{name}</Text>
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
      }),
    ).start();
  }, []);

  return (
    <Animated.View style={{ transform: [{ translateX }] }} className="flex-row">
      {[...reviews, ...reviews].map((review, i) => {
        return (
          <View key={i} style={{ marginRight: GAP }}>
            <ReviewCard text={review.text} name={review.name} />
          </View>
        );
      })}
    </Animated.View>
  );
};

const OnboardingRating = () => {
  return (
    <View className="flex-1 pt-28 gap-6">
      <Text className="text-light2 font-bold text-4xl text-center">
        Help us grow
      </Text>

      <View className="items-center gap-2">
        <Image
          source={require("../../assets/DarkAppIcon.png")}
          className="w-[64px] h-[64px] rounded-xl"
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
