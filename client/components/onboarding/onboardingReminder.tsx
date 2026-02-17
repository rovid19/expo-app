import { ResizeMode, Video } from "expo-av";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { bell, check } from "../../assets/icons/icons";
import Button from "../app/button";
import { useOnboardingStore } from "../../stores/onboardingStore";
import * as Notifications from "expo-notifications";

const onboardingReminder = () => {
  const { setOnboardingStep, onboardingStep } = useOnboardingStore();
  return (
    <View className="flex-1 items-center flex flex-col gap-8 pt-28">
      <View className="flex flex-col gap-2 items-center justify-center">
        <Text className="text-light2 font-bold text-4xl">We'll send you</Text>
        <Text className="text-light2 font-bold text-4xl">
          a reminder before your
        </Text>
        <Text className="text-light2 font-bold text-4xl">free trial ends.</Text>
      </View>

      <View className="flex-1 w-full items-center justify-center">
        <SvgXml xml={bell} width={256} height={256} color="#E6E6E6" />
      </View>

      <View className="w-full flex flex-col gap-2 items-center justify-center pb-12">
        <View className="w-full flex flex-row gap-2 items-center justify-center">
          <SvgXml xml={check} width={24} height={24} color="#E6E6E6" />
          <Text className="text-light2 font-bold text-xl">
            No Payment Due Now
          </Text>
        </View>

        <Button
          title="Continue for FREE"
          onPress={async () => {
            setOnboardingStep(onboardingStep + 1);
            await Notifications.requestPermissionsAsync();
          }}
          iconSize={24}
          backgroundColor="bg-accent1"
          textColor="text-dark1"
          padding={6}
          bold={true}
        />

        <Text className="text-light3 font-bold text-base">
          3 days free, then $34,99 per year (2,91 $/mo)
        </Text>
      </View>
    </View>
  );
};

export default onboardingReminder;
