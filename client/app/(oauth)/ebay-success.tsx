import { useEffect } from "react";
import { usePopupStore } from "../../stores/popupStore";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import { router } from "expo-router";

export default function EbaySuccess() {
  const { close } = usePopupStore();
  useEffect(() => {
    close();
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
