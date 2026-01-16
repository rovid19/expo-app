import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { coinIcon, inventoryIcon, walletIcon } from "../../assets/icons/icons";

const overview = () => {
  return (
    <>
      {/* Profit */}
      <View className="p-6 flex flex-col gap-2 bg-accent1 rounded-3xl w-full">
        <View className="flex flex-row gap-2 items-center">
          <SvgXml xml={coinIcon} width={24} height={24} color="#0D0D0D" />
          <Text className=" font-sans text-lg text-dark1"> Profit</Text>
        </View>
        <Text className="font-bold text-5xl text-dark1">$100</Text>
      </View>

      {/* Inventory */}
      <View className="p-6 flex flex-col gap-2 bg-dark2 rounded-3xl w-full">
        <View className="flex flex-row gap-2 items-center">
          <SvgXml xml={inventoryIcon} width={24} height={24} color="#E6E6E6" />
          <Text className=" font-sans text-lg text-light2"> Inventory</Text>
        </View>
        <Text className="font-medium text-3xl text-light2">42 items</Text>
      </View>

      {/* Total worth */}
      <View className="p-6 flex flex-col gap-2 bg-dark2 rounded-3xl w-full">
        <View className="flex flex-row gap-2 items-center">
          <SvgXml xml={walletIcon} width={24} height={24} color="#E6E6E6" />
          <Text className=" font-sans text-lg text-light2"> Total worth</Text>
        </View>
        <Text className="font-medium text-3xl text-light2">$1200</Text>
      </View>
    </>
  );
};

export default overview;
