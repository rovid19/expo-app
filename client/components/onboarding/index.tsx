import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Welcome from "./welcome";
import OnboardingQuestions from "./onboardingQuestions";
import { SvgXml } from "react-native-svg";
import { leftArrow } from "../../assets/icons/icons";
import OnboardingValueProposition from "./onboardingValueProposition";
import OnboardingVideo from "./onboardingVideo";
import OnboardingRating from "./onboardingRating";
import * as StoreReview from "expo-store-review";

const index = () => {
  const [onboardingStep, setOnboardingStep] = useState<number>(0);
  const [answerSelected, setAnswerSelected] = useState<number[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const disableContinueButton =
    answerSelected.length < onboardingStep &&
    onboardingStep !== 4 &&
    onboardingStep < 5;

  console.log(answers);
  return (
    <View className="flex-1 bg-dark1 px-4 flex flex-col gap-8">
      {/*Header*/}
      {onboardingStep > 0 && onboardingStep < 6 && (
        <View className="flex flex-row items-center justify-center gap-4 pt-20 ">
          <TouchableOpacity
            onPress={() =>
              setOnboardingStep((prev) => {
                if (prev) {
                  return prev - 1;
                } else {
                  return prev;
                }
              })
            }
            className="py-4 flex items-center justify-center"
          >
            <SvgXml xml={leftArrow} width={24} height={24} color="#E6E6E6" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center">
            <View className="h-4 w-full bg-dark2 relative rounded-full">
              <View
                style={{
                  width: `${(onboardingStep / 5) * 100}%`,
                }}
                className="h-full w-[10%] bg-light2 absolute top-0 left-0 rounded-full"
              ></View>
            </View>
          </View>
        </View>
      )}
      {onboardingStep === 0 && (
        <Welcome setOnboardingStep={setOnboardingStep} />
      )}
      {onboardingStep > 0 && onboardingStep !== 4 && (
        <OnboardingQuestions
          setAnswers={setAnswers}
          setAnswerSelected={setAnswerSelected}
          answerSelected={answerSelected}
          onboardingStep={onboardingStep}
        />
      )}

      {onboardingStep === 4 && <OnboardingValueProposition />}

      {onboardingStep === 6 && <OnboardingVideo />}

      {onboardingStep === 7 && <OnboardingRating />}

      {/*Action Buttons*/}
      {onboardingStep > 0 && (
        <View className="pb-12 w-full">
          <TouchableOpacity
            disabled={disableContinueButton}
            className={`${
              onboardingStep >= 7 ? "bg-accent1" : "bg-dark2"
            } rounded-full p-6 ${
              disableContinueButton ? "opacity-50" : "opacity-100"
            }`}
            onPress={async () => {
              setOnboardingStep(onboardingStep + 1);
              if (onboardingStep === 7) {
                const available = await StoreReview.isAvailableAsync();
                if (available) {
                  await StoreReview.requestReview();
                  setOnboardingStep(onboardingStep + 1);
                }
              }
            }}
          >
            <Text
              className={`${
                onboardingStep >= 7 ? "text-dark1" : "text-light2"
              } text-center font-bold text-lg`}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default index;
