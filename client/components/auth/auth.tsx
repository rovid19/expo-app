import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { supabase } from "../../services/supabase/supabaseClient";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as AppleAuthentication from "expo-apple-authentication";
import Loader from "../app/loader";
import { SvgXml } from "react-native-svg";
import { appleLogo, googleLogo, logo } from "../../assets/icons/icons";

WebBrowser.maybeCompleteAuthSession();

const Auth = () => {
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
          } else {
            console.log("Session established successfully");
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

  const signInWithGoogle = async () => {
    try {
      const redirectUrl = Linking.createURL("auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === "success" && result.url) {
          const urlObj = new URL(result.url);
          const code = urlObj.searchParams.get("code");

          if (code) {
            await supabase.auth.exchangeCodeForSession(code);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token from Apple");
      }

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      console.log(data);
      console.log(error);
    } catch (err) {
      console.error("Apple sign-in error:", err);
    }
  };

  return (
    <View className="flex-1 bg-dark1 py-8 px-4">
      <View className="flex-1 items-center justify-center">
        <SvgXml xml={logo} width={128} height={128} color="#83BD0F" />
      </View>

      <View className="flex-1 flex flex-col gap-8 px-2">
        <View className="flex flex-col gap-1 items-center justify-center">
          <Text className="text-5xl font-bold text-white">Welcome</Text>
          <Text className="text-lg text-light3 font-sans">
            Your journey starts from here
          </Text>
        </View>

        <View className="flex flex-col gap-4 w-full">
          <TouchableOpacity
            onPress={signInWithGoogle}
            activeOpacity={0.8}
            className="w-full p-6 rounded-3xl bg-dark2 justify-center items-center flex flex-row gap-2"
          >
            <SvgXml xml={googleLogo} width={20} height={20} color="#E94335" />
            <Text className="text-lg font-sans text-light1">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signInWithApple}
            activeOpacity={0.8}
            className="w-full p-6 rounded-3xl bg-dark2 justify-center items-center flex flex-row gap-2"
          >
            <SvgXml xml={appleLogo} width={24} height={24} color="#000000" />
            <Text className="text-lg font-sans text-light1">
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row gap-2 items-center justify-center">
          <Text className="text-sm font-sans text-light3 text-center">
            By pressing on “Continue with...” you agree to our{" "}
            <Text className="font-bold text-light3">Terms of Service</Text> and{" "}
            <Text className="font-bold text-light3">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Auth;

/*
  <View className="flex-1 justify-center items-center px-8">
        <Text className="text-3xl font-bold text-black mb-2">Welcome</Text>

        <Text className="text-base text-gray-500 mb-12">
          Sign in to continue
        </Text>

        <View className="w-full gap-4">
          <TouchableOpacity
            onPress={signInWithGoogle}
            activeOpacity={0.8}
            className="w-full h-14 rounded-xl border border-gray-200 bg-white justify-center items-center"
          >
            <Text className="text-base font-semibold text-black">
              Continue with Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signInWithApple}
            activeOpacity={0.8}
            className="w-full h-14 rounded-xl bg-black justify-center items-center"
          >
            <Text className="text-base font-semibold text-white">
              Continue with Apple
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      */
