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
import { useAppStore } from "../../stores/appStore";

const ListingHeader = () => {
  const { setIsModal } = useAppStore();
  const { findSelectedItem } = useItems2Store();
  const item = findSelectedItem();

  return (
    <View className="flex flex-row justify-between items-center">
      <View className="flex-1 ">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-light2 font-sans text-3xl"
        >
          {item?.detected_item}
        </Text>
      </View>
      <View className=" flex justify-end items-end">
        <TouchableOpacity
          className="bg-accent2 rounded-full px-4 py-2 flex flex-row items-center gap-2"
          onPress={() => {
            //setIsEditListingModalVisible(true);
            setIsModal({
              visible: true,
              content: <EditListing />,
              popupContent: null,
            });
          }}
        >
          <SvgXml xml={editIcon} width={24} height={24} color="#E6E6E6" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListingHeader;
