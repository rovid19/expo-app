import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useOnboardingStore } from "../../stores/onboardingStore";

interface WelcomeProps {
  setOnboardingStep: (step: number) => void;
}

const Welcome = ({ setOnboardingStep }: WelcomeProps) => {
  const { setIsOnboarding } = useOnboardingStore();
  return (
    <View className="flex-1 items-center justify-center p-4 gap-8">
      <View className="flex-1 items-center justify-center"></View>

      <View className="w-full items-center justify-center px-2 flex-col gap-4 pb-12">
        <View className="flex flex-col items-center justify-center">
          <Text className="text-5xl font-bold text-light2">Reselling</Text>
          <Text className="text-5xl font-bold text-light2">made easy</Text>
        </View>

        <TouchableOpacity
          className="bg-accent1 rounded-full p-4 w-full"
          onPress={() => setOnboardingStep(1)}
        >
          <Text className="text-dark1 text-center font-bold text-lg">
            Get Started
          </Text>
        </TouchableOpacity>
        <View className="flex flex-row items-center justify-center gap-1">
          <Text className="text-center text-sm text-light3">
            Already have an account?{" "}
          </Text>
          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem("hasLaunched", "true");
              setIsOnboarding(false);
            }}
            className="font-bold items-center justify-center"
          >
            <Text className="font-bold text-light3 text-sm">Sign In</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Welcome;
