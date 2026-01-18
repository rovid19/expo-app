import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";

const ListingActions = () => {
  const { isEditDetails } = useListingDetailsStore();
  return (
    <>
      <TouchableOpacity className="w-full bg-accent1 flex flex-row items-center justify-center p-4 rounded-3xl">
        <Text className="text-lg font-bold text-dark1">
          {isEditDetails ? "Save" : "Sell"}
        </Text>
      </TouchableOpacity>
      {!isEditDetails && (
        <TouchableOpacity className="w-full bg-dark2 flex flex-row items-center justify-center p-4 rounded-3xl">
          <Text className="text-lg font-bold text-light2">More</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export default ListingActions;
