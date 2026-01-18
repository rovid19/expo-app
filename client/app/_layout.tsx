import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/supabaseClient";
import { useUserStore } from "../stores/userStore";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import GlobalPopup from "../components/popup";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);

  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!loaded) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <GlobalPopup />
    </GestureHandlerRootView>
  );
}
