import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { editIcon, leftArrow } from "../../assets/icons/icons";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";
import { useItems2Store } from "../../stores/items2Store";
import { usePopupStore } from "../../stores/popupStore";
import EditListing from "./modals/editListing";

const ListingHeader = () => {
  const { setIsEditListingModalVisible } = useListingDetailsStore();
  const { findSelectedItem } = useItems2Store();
  const item = findSelectedItem();
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex-1">
        <Text className="text-light2 font-sans text-3xl">
          {item?.detected_item}
        </Text>
      </View>
      <View className=" flex justify-end items-end">
        <TouchableOpacity
          className="bg-accent2 rounded-full px-4 py-2 flex flex-row items-center gap-2"
          onPress={() => {
            setIsEditListingModalVisible(true);
          }}
        >
          <SvgXml xml={editIcon} width={24} height={24} color="#E6E6E6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListingHeader;
