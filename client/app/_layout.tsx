import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import GlobalPopup from "../components/popup/popup";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useListingDetailsStore } from "../stores/listingDetailsStore";
import { Modal, Platform } from "react-native";
import Toast from "react-native-toast-message";
import toastConfig from "../components/app/toastConfig";
import ListingDetailsBottomSheet from "../components/listingDetails/index";
import { useAppStore } from "../stores/appStore";
import useAuth from "../hooks/useAuth";
import Purchases from "react-native-purchases";
import { LOG_LEVEL } from "react-native-purchases";

export default function RootLayout() {
  const [revenueCatConfigured, setRevenueCatConfigured] = useState(false);
  const { setListingDetailsBottomSheetRef } = useListingDetailsStore();
  const listingDetailsBottomSheetRef = useRef<BottomSheetModal>(null);
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });
  const { isModal, closeModal } = useAppStore();
  useAuth({ revenueCatConfigured });

  const configureRevenueCat = async () => {
    try {
      Purchases.setLogLevel(LOG_LEVEL.ERROR);
      if (Platform.OS === "ios") {
        Purchases.configure({
          apiKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS || "",
        });
      } else if (Platform.OS === "android") {
        //Purchases.configure({ apiKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID || '' });
      }
    } catch (error) {
      console.error("❌ Failed to configure RevenueCat:", error);
    } finally {
      setRevenueCatConfigured(true);
    }
  };

  useEffect(() => {
    configureRevenueCat();
    setListingDetailsBottomSheetRef(
      listingDetailsBottomSheetRef as React.RefObject<BottomSheetModal>,
    );
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Modal
        visible={isModal?.visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => closeModal()}
      >
        {isModal?.content}
        {isModal?.popupContent && (
          <GlobalPopup content={isModal.popupContent} />
        )}
      </Modal>
      <ListingDetailsBottomSheet ref={listingDetailsBottomSheetRef} />
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
