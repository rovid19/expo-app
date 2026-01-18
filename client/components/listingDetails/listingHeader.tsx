import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { editIcon, leftArrow } from "../../assets/icons/icons";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";

const ListingHeader = () => {
  const { isEditDetails, setIsEditDetails } = useListingDetailsStore();
  return (
    <View
      className={`flex flex-row items-center ${
        isEditDetails ? "justify-start gap-4" : "justify-between"
      }`}
    >
      {!isEditDetails && (
        <>
          {" "}
          <Text className="text-light2 font-sans text-3xl">Macbook Pro M1</Text>
          <TouchableOpacity
            className="bg-accent2 rounded-full px-4 py-2 flex flex-row items-center gap-2"
            onPress={() => setIsEditDetails(true)}
          >
            <SvgXml xml={editIcon} width={24} height={24} color="#E6E6E6" />
          </TouchableOpacity>{" "}
        </>
      )}
      {isEditDetails && (
        <>
          <TouchableOpacity
            className=" flex flex-row items-center"
            onPress={() => setIsEditDetails(false)}
          >
            <SvgXml xml={leftArrow} width={24} height={24} color="#E6E6E6" />
          </TouchableOpacity>
          <Text className="text-light2 font-sans text-3xl">
            Listing Details
          </Text>
        </>
      )}
    </View>
  );
};

export default ListingHeader;
