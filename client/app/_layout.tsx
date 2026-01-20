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
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useListingDetailsStore } from "../stores/listingDetailsStore";
import { Modal } from "react-native";
import FacebookMarketplacePost from "../components/listingDetails/modals/FacebookMarketplacePost";
import { useItemsStore } from "../stores/itemsStore";
import * as Linking from "expo-linking";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const { isFacebookModalVisible, setIsFacebookModalVisible } =
    useListingDetailsStore();
  const { selectedScannedItem } = useItemsStore();
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

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      if (url === "dexly://ebay-success") {
        console.log("ebay success");
        Toast.show({
          type: "success",
          text1:
            "Your eBay account has been connected successfully. Try listing your first item now!",
        });
      }
      if (url === "dexly://ebay-error") {
        console.log("ebay error");
        Toast.show({
          type: "error",
          text1:
            "There was an error connecting your eBay account. Please try again.",
        });
      }
    });
    return () => sub.remove();
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

      <Modal
        visible={isFacebookModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFacebookModalVisible(false)}
      >
        <FacebookMarketplacePost
          listing={{
            id: 1,
            detected_item: "Macbook Pro M1",
            resale_price_min: 1000,
            resale_price_max: 1500,
            confidence: 0.95,
            image: [],
            category: "other",
            details: "Macbook Pro M1",
            price: 1000,
          }}
          onClose={() => setIsFacebookModalVisible(false)}
        />
      </Modal>
      <Toast />
    </GestureHandlerRootView>
  );
}
