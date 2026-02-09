import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { paywall } from "../../assets/icons/icons";
import colors from "tailwindcss/colors";
import { report } from "../../assets/icons/icons";
import { logout } from "../../assets/icons/icons";
import { router } from "expo-router";
import { supabase } from "../../services/supabase/supabaseClient";
import { useUserStore } from "../../stores/userStore";
import Purchases from "react-native-purchases";

interface profileActionsProps {
  onPressSubscription: () => void;
  onPressReport: () => void;
}

const profileActions = ({
  onPressSubscription,
  onPressReport,
}: profileActionsProps) => {
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
      router.replace("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <View className="w-full flex flex-col gap-2 px-2">
      <TouchableOpacity
        onPress={onPressSubscription}
        className="bg-dark2 p-2 rounded-2xl h-[44px] flex items-center px-4 flex-row gap-2 "
      >
        <SvgXml xml={paywall} width={24} height={24} color="#E6E6E6" />
        <Text className="text-md font-sans text-light2">
          Subscription details
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPressReport}
        className="bg-dark2 p-2 rounded-2xl h-[44px] flex items-center px-4 flex-row gap-2 "
      >
        <SvgXml xml={report} width={24} height={24} color="#E6E6E6" />
        <Text className="text-md font-sans text-light2">Report a bug</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-dark2 p-2 rounded-2xl h-[44px] flex items-center px-4 flex-row gap-2 "
      >
        <SvgXml xml={logout} width={24} height={24} color="#E6E6E6" />
        <Text className="text-md font-sans text-light2">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default profileActions;
