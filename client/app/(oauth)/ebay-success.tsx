import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { useAppStore } from "../../stores/appStore";

export default function EbaySuccess() {
  const { closeModal } = useAppStore();
  useEffect(() => {
    closeModal();
    Toast.show({
      type: "success",
      text1: "Ebay connected",
      text2: "Try listing your first item now!",
      position: "top",
    });
    router.replace("/(tabs)/home");
  }, []);
  return null;
}
