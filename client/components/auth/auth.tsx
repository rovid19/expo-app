import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "../../services/supabase/supabaseClient";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { SvgXml } from "react-native-svg";
import { leftArrow, logo } from "../../assets/icons/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingStore } from "../../stores/onboardingStore";
import ContinueWithGoogle from "./continueWithGoogle";
import ContinueWithApple from "./continueWithApple";
import ContinueWithEmail from "./continueWithEmail";
import AuthFooter from "./authFooter";
import ContentContainer from "../app/contentContainer";

WebBrowser.maybeCompleteAuthSession();

const Auth = () => {
  const { setIsOnboarding, isOnboarding, setOnboardingStep } =
    useOnboardingStore();
  const [continueWithEmail, setContinueWithEmail] = useState(false);

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;

      if (url && url.includes("auth/callback")) {
        const urlObj = new URL(url);
        const code = urlObj.searchParams.get("code");

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            console.error("Error exchanging code for session:", error);
          }
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-dark1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ContentContainer className="py-8 px-4">
        <View
          className={`flex flex-row items-center ${continueWithEmail ? "justify-between" : "justify-center"} pt-8`}
        >
          {continueWithEmail && (
            <TouchableOpacity
              onPress={() => {
                setContinueWithEmail(false);
              }}
              activeOpacity={0.8}
            >
              <SvgXml xml={leftArrow} width={24} height={24} color="#E6E6E6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("hasLaunched");
              setIsOnboarding(true);
              setOnboardingStep(0);
            }}
          >
            <Text className="text-light3 text-sm">Restore</Text>
          </TouchableOpacity>
        </View>
        {!continueWithEmail && (
          <View className="flex-1 items-center justify-center ">
            <SvgXml xml={logo} width={128} height={128} color="#83BD0F" />
          </View>
        )}

        {!continueWithEmail ? (
          <View className=" flex flex-col gap-8 px-2">
            <View className="flex flex-col gap-1 items-center justify-center">
              <Text className="text-5xl font-bold text-white">Welcome</Text>
              <Text className="text-lg text-light3 font-sans">
                Your journey starts from here
              </Text>
            </View>

            <View className="flex flex-col gap-4 w-full">
              <ContinueWithGoogle />
              <ContinueWithApple />

              <View className="h-8 w-full flex flex-row gap-2 py-2 px-2">
                <View className="h-full w-[45%] rounded-l-full flex items-center justify-center py-1">
                  <View className="h-full w-full bg-dark2/30 rounded-l-full"></View>
                </View>
                <View className="flex-1 flex items-center justify-center">
                  <Text className="text-sm font-sans text-light3 text-center ">
                    OR
                  </Text>
                </View>

                <View className="h-full w-[45%] rounded-r-full flex items-center justify-center py-1">
                  <View className="h-full w-full bg-dark2/30 rounded-r-full"></View>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => setContinueWithEmail(true)}
                activeOpacity={0.8}
                className="w-full p-4 rounded-3xl bg-dark2 justify-center items-center flex flex-row gap-2"
              >
                <Text className="text-lg font-sans text-light1">
                  Continue with Email
                </Text>
              </TouchableOpacity>
            </View>

            <AuthFooter />
            <View className="h-10 w-full"></View>
          </View>
        ) : (
          <ContinueWithEmail setContinueWithEmail={setContinueWithEmail} />
        )}
      </ContentContainer>
    </KeyboardAvoidingView>
  );
};

export default Auth;
