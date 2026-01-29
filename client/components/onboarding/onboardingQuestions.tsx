import { useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

interface OnboardingQuestionsProps {
  setAnswers: (answers: (prev: string[]) => string[]) => void;
  setAnswerSelected: (selected: (prev: number[]) => number[]) => void;
  answerSelected: number[];
  onboardingStep: number;
}

const onboarding1 = [
  ["What do you mainly resell?"],
  ["Electronics", "Clothes/shoes", "Collectibles", "Personal items", "Other"],
];

const onboarding2 = [
  ["Where do you mainly sell?"],
  ["Facebook Marketplace", "eBay", "Vinted", "In person", "Other"],
];

const onboarding3 = [
  ["Where do you usually find items?"],
  [
    "Thrift / second-hand stores",
    "Retail arbitrage",
    "Online deals",
    "Personal items",
  ],
];

const onboarding5 = [
  ["How experienced are you with reselling?"],
  ["Just starting", "Some experience", "Full-time"],
];

const OnboardingQuestions = ({
  setAnswers,
  setAnswerSelected,
  answerSelected,
  onboardingStep,
}: OnboardingQuestionsProps) => {
  const data = useMemo(() => {
    switch (onboardingStep) {
      case 1:
        return onboarding1;
      case 2:
        return onboarding2;
      case 3:
        return onboarding3;
      case 5:
        return onboarding5;
      default:
        return null;
    }
  }, [onboardingStep]);

  if (!data) return null;

  const handleSetAnswers = (answer: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[onboardingStep - 1] = answer;
      return updated;
    });
  };

  return (
    <View className="flex-1 items-center justify-center gap-8">
      {/* Question */}
      <Animated.View
        key={`question-${onboardingStep}`}
        entering={FadeIn.duration(180)}
        className="px-4"
      >
        <Text className="text-light2 font-bold text-4xl text-center">
          {data[0][0]}
        </Text>
      </Animated.View>

      {/* Answers */}
      <View className="flex-1 w-full gap-4 justify-center items-center">
        {data[1].map((answer, index) => (
          <Animated.View
            key={`${onboardingStep}-${index}`}
            entering={FadeInUp.duration(180).delay(80 + index * 40)}
            className="w-full"
          >
            <TouchableOpacity
              className="rounded-full p-6 w-full"
              style={{
                backgroundColor:
                  answerSelected?.[onboardingStep - 1] === index
                    ? "#0F49BD"
                    : "#1A1A1A",
              }}
              onPress={() => {
                handleSetAnswers(answer);
                setAnswerSelected((prev) => {
                  const updated = [...prev];
                  updated[onboardingStep - 1] = index;
                  return updated;
                });
              }}
            >
              <Text className="text-light2 text-center font-bold text-xl">
                {answer}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

export default OnboardingQuestions;
