import React, { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { ScannedItem } from "../../globalTypes";

interface UserIncomeProps {
  items: ScannedItem[];
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const UserIncome: React.FC<UserIncomeProps> = ({
  items,
  setTriggerRefresh,
}) => {
  const { totalInventoryValue, soldIncome, soldCount } = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price, 0);
    const soldItems = items.filter((item) => item.isSold === true);
    const soldTotal = soldItems.reduce((sum, item) => sum + item.price, 0);
    return {
      totalInventoryValue: total,
      soldIncome: soldTotal,
      soldCount: soldItems.length,
    };
  }, [items]);

  const handleRefresh = () => setTriggerRefresh((prev) => !prev);

  return (
    <View className="w-full px-4 pt-5">
      <View className="rounded-2xl bg-black p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-white">Overview</Text>
          <Pressable
            onPress={handleRefresh}
            className="rounded-full bg-white/15 px-3 py-1"
            accessibilityRole="button"
            accessibilityLabel="Refresh dashboard"
          >
            <Text className="text-xs font-semibold text-white">Refresh</Text>
          </Pressable>
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-white/10 p-3">
            <Text className="text-xs text-white/80">Total stored value</Text>
            <Text className="mt-1 text-xl font-bold text-white">
              {formatCurrency(totalInventoryValue)}
            </Text>
          </View>

          <View className="flex-1 rounded-2xl bg-white/10 p-3">
            <Text className="text-xs text-white/80">Income (sold)</Text>
            <Text className="mt-1 text-xl font-bold text-white">
              {formatCurrency(soldIncome)}
            </Text>
            <Text className="mt-1 text-[11px] text-white/70">
              {soldCount} sold {soldCount === 1 ? "item" : "items"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserIncome;
