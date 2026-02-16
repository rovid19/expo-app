import { Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { supabase } from "../../services/supabase/supabaseClient";
import { SvgXml } from "react-native-svg";
import { googleLogo } from "../../assets/icons/icons";

const continueWithGoogle = () => {
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
          redirectUrl,
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

  return (
    <TouchableOpacity
      onPress={signInWithGoogle}
      activeOpacity={0.8}
      className="w-full p-4 rounded-3xl bg-dark2 justify-center items-center flex flex-row gap-2"
    >
      <SvgXml xml={googleLogo} width={20} height={20} color="#E94335" />
      <Text className="text-lg font-sans text-light1">
        Continue with Google
      </Text>
    </TouchableOpacity>
  );
};

export default continueWithGoogle;
