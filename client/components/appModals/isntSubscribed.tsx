import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { unsureMascot } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import { supabase } from "../../services/supabase/supabaseClient";
import { router } from "expo-router";
import Purchases from "react-native-purchases";
import { useUserStore } from "../../stores/userStore";
import { useAppStore } from "../../stores/appStore";

const isntSubscribed = () => {
  const { setIsModal } = useAppStore();
  const { setUser, setIsSubscribed, setAuthFinished } = useUserStore();
  const handleLogout = async () => {
    try {
      // 1. Log out of RevenueCat FIRST (before anything else)
      await Purchases.logOut();

      // 2. Clear subscription state
      setIsSubscribed(false);
      setAuthFinished(false);

      // 3. Log out of Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // 4. Clear user from store
      setUser(null);

      // 5. Close modal and navigate
      setIsModal({ visible: false, content: null, popupContent: null });
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <View className="flex-1 justify-center items-center bg-dark1/50 relative">
      <BlurView intensity={20} tint="dark" className="absolute inset-0" />

      <View className="w-full flex flex-col justify-center items-center gap-2 bg-dark1 p-8 rounded-3xl">
        <SvgXml xml={unsureMascot} width={64} height={64} />

        <Text className="text-light1  text-xl font-medium text-center mt-2">
          You are not subscribed to the app
        </Text>
        <Text className="text-light2 font-sans text-center">
          Please delete the app and reinstall it to continue or log into the
          account that has active subscription
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-accent2 px-8 text-dark1 px-4 py-2 rounded-3xl mt-4"
        >
          <Text className="text-light1 text-lg font-medium">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default isntSubscribed;
