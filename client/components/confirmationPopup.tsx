import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { unsureMascot } from "../assets/icons/icons";
import { usePopupStore } from "../stores/popupStore";
interface ConfirmationPopupProps {
  text: string;
}
const confirmationPopup = ({ text }: ConfirmationPopupProps) => {
  const { requiresConfirmation, close } = usePopupStore();
  const performSelectedPopupAction = () => {
    console.log("performing selected popup action");
    if (requiresConfirmation.action) {
      requiresConfirmation.action();
    }
    close();
  };
  return (
    <View className="flex flex-col items-center justify-center gap-4">
      <SvgXml xml={unsureMascot} width={64} height={64} />
      <View className="flex flex-col items-center justify-center gap-2">
        <Text className="text-light2 text-lg font-bold text-center mb-2">
          {text}
        </Text>
        <View className="w-full flex flex-row items-center justify-center gap-2">
          <TouchableOpacity
            className="w-1/2 flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-accent1"
            onPress={performSelectedPopupAction}
          >
            <Text className="text-dark1 text-lg font-bold">Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={close}
            className="w-1/2 flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
          >
            <Text className="text-light2 text-lg font-sans">Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default confirmationPopup;
