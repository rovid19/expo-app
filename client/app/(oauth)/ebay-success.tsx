import { useEffect } from "react";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useAppStore } from "../../stores/appStore";

export default function EbaySuccess() {
  const { closeModal } = useAppStore();
  useEffect(() => {
    closeModal();
    console.log("ebay success");
    Toast.show({
      type: "success",
      text1: "Ebay connected",
      text2: "Try listing your first item now!",
      position: "top",
    });
    router.back();
  }, []);
  return null;
}
