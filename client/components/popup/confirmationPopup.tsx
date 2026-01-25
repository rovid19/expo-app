import React, { use, useEffect } from "react";
import { View, Text, TouchableOpacity, Keyboard } from "react-native";
import { SvgXml } from "react-native-svg";
import { unsureMascot } from "../../assets/icons/icons";
import { usePopupStore } from "../../stores/popupStore";
import { useAppStore } from "../../stores/appStore";
interface ConfirmationPopupProps {
  text: string;
  buttonText1: string;
  buttonText2: string;
  popupAction: () => void;
}
const confirmationPopup = ({
  text,
  buttonText1,
  buttonText2,
  popupAction,
}: ConfirmationPopupProps) => {
  const { closeModal } = useAppStore();
  const { setRequiresConfirmation } = usePopupStore();

  useEffect(() => {
    setRequiresConfirmation(true);
    Keyboard.dismiss();
  }, []);

  const performSelectedPopupAction = () => {
    if (popupAction) {
      popupAction();
    }

    closeModal();
    setRequiresConfirmation(false);
  };
  return (
    <View className="flex flex-col items-center justify-center gap-4">
      <SvgXml xml={unsureMascot} width={64} height={64} />
      <View className="flex flex-col items-center justify-center gap-2">
        <Text className="text-light2 text-md font-bold text-center mb-2">
          {text}
        </Text>
        <View className="w-full flex flex-row items-center justify-center gap-2 mt-4">
          <TouchableOpacity
            className="w-1/2 flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-accent1"
            onPress={performSelectedPopupAction}
          >
            <Text className="text-dark1 text-md font-bold">{buttonText1}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              closeModal();
              setRequiresConfirmation(false);
            }}
            className="w-1/2 flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
          >
            <Text className="text-light2 text-md font-sans">{buttonText2}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default confirmationPopup;
