import { View, Text, Image } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const OnboardingValueProposition = () => {
  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      className="flex-1 items-center justify-center gap-10"
    >
      <Animated.View entering={FadeInUp.duration(200)} className="px-4 gap-2">
        <Text className="text-light2 font-bold text-4xl">
          Most people misprice items before checking real market data
        </Text>
        <Text className="text-light3 text-lg">
          Dexly provides real market insights to match real resale value
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(250).duration(180)}
        className="items-center"
      >
        <Image
          source={require("../../assets/chair.png")}
          className="w-[150px] h-[150px]"
        />
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(140).duration(180)}
        className="gap-3 w-full px-4"
      >
        <View className="bg-danger p-2 items-center rounded-3xl">
          <Text className="text-light2 text-xl">Your guess</Text>
          <Text className="text-light2 font-bold text-2xl">$100</Text>
        </View>
        <View className="bg-accent1 p-2 items-center rounded-3xl">
          <Text className="text-dark1 text-xl">Real market value</Text>
          <Text className="text-dark1 font-bold text-2xl">$140 – $180</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default OnboardingValueProposition;
