import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { check, thrash } from "../assets/icons/icons";
import { usePopupStore } from "../stores/popupStore";
import ConfirmationPopup from "./confirmationPopup";
import { useItemsStore } from "../stores/itemsStore";
const actionPopup = () => {
  const { requiresConfirmation, setRequiresConfirmation } = usePopupStore();
  const { removeScannedItem, selectedScannedItem } = useItemsStore();
  const handleDeleteItem = () => {
    if (selectedScannedItem) {
      removeScannedItem(selectedScannedItem);
    }
  };
  return (
    <>
      {!requiresConfirmation.isTrue ? (
        <View className="  rounded-3xl gap-4">
          <Text className="text-light2 text-2xl font-bold text-center mb-2">
            Actions
          </Text>
          <TouchableOpacity className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2">
            <Text className="text-light2 text-lg font-sans">Mark as sold</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-danger"
            onPress={() =>
              setRequiresConfirmation(
                true,
                handleDeleteItem as (() => void) | null
              )
            }
          >
            <SvgXml xml={thrash} width={16} height={16} color="#E6E6E6" />
            <Text className="text-light2 text-lg font-sans">Delete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ConfirmationPopup text="Are you sure you want to delete this item?" />
      )}
    </>
  );
};

export default actionPopup;
