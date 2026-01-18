import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";
import { SvgXml } from "react-native-svg";
import { moreIcon, sellIcon } from "../../assets/icons/icons";
import { usePopupStore } from "../../stores/popupStore";
import ActionPopup from "../actionPopup";

const ListingActions = () => {
  const { isEditDetails } = useListingDetailsStore();
  const { open } = usePopupStore();
  return (
    <>
      <TouchableOpacity className="w-full bg-accent1 flex flex-row items-center justify-center p-4 rounded-3xl gap-2">
        <Text className="text-lg font-bold text-dark1">
          {isEditDetails ? "Save" : "Sell"}
        </Text>
      </TouchableOpacity>
      {!isEditDetails && (
        <TouchableOpacity
          className="w-full bg-dark2 flex flex-row items-center justify-center p-4 rounded-3xl gap-2"
          onPress={() => open(<ActionPopup />)}
        >
          <Text className="text-lg font-bold text-light2">More</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ListingActions;
