import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { ScannedItem } from "../../globalTypes";
import { useUserStore } from "../../stores/userStore";
import { SvgXml } from "react-native-svg";
import { layersIcon } from "../../assets/icons/icons";

interface UserIncomeProps {
  items: ScannedItem[];
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const returnCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "";
  }
};

const UserIncome: React.FC<UserIncomeProps> = ({
  items,
  setTriggerRefresh: _setTriggerRefresh,
}) => {
  const { currency } = useUserStore();
  const { totalWorth, totalItems, profit } = useMemo(() => {
    const total = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    const soldItems = items.filter((item) => item.isSold === true);
    const soldTotal = soldItems.reduce(
      (sum, item) => sum + (item.price ?? 0),
      0
    );
    return {
      totalWorth: total,
      totalItems: items.length,
      profit: soldTotal,
    };
  }, [items]);

  return (
    <View className="w-full flex-col px-4 pb-4 mt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between pb-4">
        <View className="flex-col gap-0.5">
          <Text className="text-4xl font-bold tracking-tight text-neutral-950">
            Overview
          </Text>
          <Text className="text-sm text-neutral-500">
            Quick overview of your inventory and sales.
          </Text>
        </View>
      </View>

      {/* Overview Card */}
      <View className="rounded-2xl bg-neutral-900 p-4 ">
        <View className="flex-row">
          {/* Net Profit */}
          <View className="flex-1  p-3">
            <Text className="text-2xl font-medium text-neutral-50">Profit</Text>
            <View className="mt-1 flex-row items-baseline gap-1">
              <Text className="text-4xl font-bold tracking-tight text-emerald-400">
                {profit}
              </Text>
              <Text className="text-4xl font-medium text-emerald-500">
                {returnCurrencySymbol(currency as string)}
              </Text>
            </View>
            <Text className="mt-2 text-xs text-neutral-500">
              {items.filter((item) => item.isSold === true).length} sold items.
            </Text>
          </View>

          {/* Total Worth */}
          <View className="flex-1 justify-center p-3 border-l border-neutral-700/40 ">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-medium text-neutral-50">
                Total
              </Text>
              <View className="flex-row items-center gap-1 bg-neutral-800 rounded-full px-2 py-1">
                <SvgXml
                  xml={layersIcon}
                  width={20}
                  height={20}
                  color="#737373"
                />
                <Text className="text-xs font-medium text-neutral-500">
                  {totalItems} items
                </Text>
              </View>
            </View>

            <View className="mt-1 flex-row items-baseline gap-1">
              <Text className="text-4xl font-bold tracking-tight text-neutral-50">
                {totalWorth}
              </Text>
              <Text className="text-4xl font-medium text-neutral-50">
                {returnCurrencySymbol(currency as string)}
              </Text>
            </View>
            <Text className="mt-2 text-xs text-neutral-500">
              Inventory value across all items.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserIncome;
