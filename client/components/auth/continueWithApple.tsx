import React from "react";
import { TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { appleLogo } from "../../assets/icons/icons";
import { supabase } from "../../services/supabase/supabaseClient";
import * as AppleAuthentication from "expo-apple-authentication";
import { Text } from "react-native";

const continueWithApple = () => {
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
    } catch (err) {
      console.error("Apple sign-in error:", err);
    }
  };
  return (
    <TouchableOpacity
      onPress={signInWithApple}
      activeOpacity={0.8}
      className="w-full p-4 rounded-3xl bg-dark2 justify-center items-center flex flex-row gap-2"
    >
      <SvgXml xml={appleLogo} width={24} height={24} color="#000000" />
      <Text className="text-lg font-sans text-light1">Continue with Apple</Text>
    </TouchableOpacity>
  );
};

export default continueWithApple;
