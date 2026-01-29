import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface WelcomeProps {
  setOnboardingStep: (step: number) => void;
}

const Welcome = ({ setOnboardingStep }: WelcomeProps) => {
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
        <Text className="text-center text-sm text-light3">
          Already have an account? <Text className="font-bold">Sign In</Text>
        </Text>
      </View>
    </View>
  );
};

export default Welcome;
