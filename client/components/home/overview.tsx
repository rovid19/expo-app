import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { coinIcon, inventoryIcon, walletIcon } from "../../assets/icons/icons";
import { useItems2Store } from "../../stores/items2Store";
import Loader from "../app/loader";
import { useAppStore } from "../../stores/appStore";

const overview = () => {
  const { items, isLoading } = useItems2Store();
  const { currencySymbol } = useAppStore();

  const totalProfit =
    items.reduce((acc, item) => {
      if (item.is_sold) {
        return acc + (item.selling_price ?? 0) - (item.buying_price ?? 0);
      }
      return acc;
    }, 0) ?? 0;

  const totalItems = items.length;

  const totalWorth =
    items.reduce((acc, item) => {
      return acc + (item.estimated_resale_price ?? 0);
    }, 0) ?? 0;
  return !isLoading ? (
    <>
      {/* Profit */}
      <View className="p-6 flex flex-col gap-2 bg-accent1 rounded-3xl w-full">
        <View className="flex flex-row gap-2 items-center">
          <SvgXml xml={coinIcon} width={24} height={24} color="#0D0D0D" />
          <Text className="font-sans text-lg text-dark1"> Profit</Text>
        </View>
        <Text className="font-bold text-5xl text-dark1">
          {currencySymbol}
          {totalProfit}
        </Text>
      </View>

      {/* Inventory */}
      <View className="p-6 flex flex-col gap-2 bg-dark2 rounded-3xl w-full">
        <View className="flex flex-row gap-2 items-center">
          <SvgXml xml={inventoryIcon} width={24} height={24} color="#E6E6E6" />
          <Text className="font-sans text-lg text-light2"> Inventory</Text>
        </View>
        <Text className="font-medium text-3xl text-light2">
          {totalItems} items
        </Text>
      </View>

      {/* Total worth */}
      <View className="p-6 flex flex-col gap-2 bg-dark2 rounded-3xl w-full">
        <View className="flex flex-row gap-2 items-center">
          <SvgXml xml={walletIcon} width={24} height={24} color="#E6E6E6" />
          <Text className="font-sans text-lg text-light2"> Total worth</Text>
        </View>
        <Text className="font-medium text-3xl text-light2">
          {currencySymbol}
          {totalWorth}
        </Text>
      </View>
    </>
  ) : (
    <Loader text="" dots={false} />
  );
};
export default overview;
