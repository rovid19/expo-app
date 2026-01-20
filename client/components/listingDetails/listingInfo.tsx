import React from "react";

import { View } from "react-native";
import { Text } from "react-native";
import { TextInput } from "react-native";
import { useItems2Store } from "../../stores/items2Store";
const ListingInfo = () => {
  const { selectedItemId, items } = useItems2Store();
  const item = items.find((item) => item.id === selectedItemId);
  if (!item) return null;

  return (
    <View className=" rounded-3xl gap-2 mt-2 ">
      <View className="flex  flex-col bg-dark3 rounded-3xl px-8 py-4">
        <Text className="text-light2 font-sans text-lg">
          Est. Resell Item Price
        </Text>
        <Text className="text-light2 font-bold text-3xl">
          ${item?.resale_price_min}
        </Text>
      </View>
      <View className="flex flex-row w-full rounded-3xl   ">
        {/* Buying price */}
        <View className="flex-1 flex-col gap-2 border border-dark2  rounded-l-3xl p-4 justify-center">
          <Text className="text-light3 font-sans text-lg ">Buying price</Text>
          <Text className="text-light2 font-bold text-3xl">${item?.price}</Text>
          {/*<View className="flex flex-row items-center gap-2 bg-dark2 rounded-3xl p-2">
            <View>
              <Text className="text-light3 font-sans text-3xl ">$</Text>
            </View>
            <View className="flex-1">
              <TextInput
                placeholder="200"
                className="text-light2 font-sans text-3xl"
              />
            </View>
          </View>*/}
        </View>
        {/* Net profit */}
        <View className="flex-1 flex-col gap-2 rounded-r-3xl p-4 justify-center bg-dark2 ">
          <Text className="text-light3 font-sans text-lg ">Net profit</Text>
          <Text className="text-accent1 font-bold text-3xl">
            ${item.price - item.resale_price_min}
          </Text>
          {/*<View className="flex flex-row items-center gap-2  rounded-3xl p-2">
         
          </View>*/}
        </View>
      </View>
    </View>
  );
};

export default ListingInfo;
