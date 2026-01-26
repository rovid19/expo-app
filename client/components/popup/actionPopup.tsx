import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SvgXml } from "react-native-svg";
import { check, saveIcon, thrash } from "../../assets/icons/icons";
import { usePopupStore } from "../../stores/popupStore";
import ConfirmationPopup from "./confirmationPopup";
import { useItems2Store } from "../../stores/items2Store";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";
import { useAppStore } from "../../stores/appStore";
import toast from "react-native-toast-message";
const actionPopup = () => {
  const { requiresConfirmation, setRequiresConfirmation } = usePopupStore();
  const {
    itemType,
    selectedItemId,
    removeItem,
    findSelectedItem,
    saveItem,
    toggleItemSold,
  } = useItems2Store();
  const { closeListingDetails } = useListingDetailsStore();
  const { closeModal } = useAppStore();
  const handleDeleteItem = async () => {
    await removeItem(selectedItemId as string);
    closeListingDetails();
  };

  const item = findSelectedItem();
  if (!item) return null;
  return (
    <>
      {!requiresConfirmation ? (
        <View className="  rounded-3xl gap-4">
          <Text className="text-light2 text-2xl font-bold text-center mb-2">
            Actions
          </Text>
          {itemType === "listed" && (
            <TouchableOpacity
              onPress={() => {
                toggleItemSold(item.is_sold ? false : true);
                closeModal();
                toast.show({
                  type: "success",
                  text1: item.is_sold
                    ? "Item marked as available"
                    : "Item marked as sold",
                });
              }}
              className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
            >
              <Text className="text-light2 text-lg font-sans">
                {item.is_sold ? "Mark as available" : "Mark as sold"}
              </Text>
            </TouchableOpacity>
          )}
          {itemType === "scanned" && (
            <TouchableOpacity
              onPress={() => {
                const item = findSelectedItem();
                if (!item) return;
                saveItem(item, true);
                closeModal();
                toast.show({
                  type: "success",
                  text1: "Item added to your collection",
                });
              }}
              className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
            >
              <SvgXml xml={saveIcon} width={16} height={16} color="#E6E6E6" />
              <Text className="text-light2 text-lg font-sans">
                Add to your collection
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-danger"
            onPress={() => setRequiresConfirmation(true)}
          >
            <SvgXml xml={thrash} width={16} height={16} color="#E6E6E6" />
            <Text className="text-light2 text-lg font-sans">Delete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ConfirmationPopup
          text="Are you sure you want to delete this item?"
          buttonText1="Delete"
          buttonText2="Cancel"
          popupAction={handleDeleteItem}
        />
      )}
    </>
  );
};

export default actionPopup;
