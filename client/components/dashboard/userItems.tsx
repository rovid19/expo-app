import React, { useCallback, useMemo } from "react";
import { ScannedItem } from "../../globalTypes";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  Pressable,
} from "react-native";

interface UserItemsProps {
  items: ScannedItem[];
  setTriggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  onItemPress?: (item: ScannedItem) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);

const UserItems: React.FC<UserItemsProps> = ({ items, onItemPress }) => {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  }, [items]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ScannedItem>) => {
      const title = item.detected_item || "Unknown item";
      const value = item.price;
      const sold = item.isSold === true;

      return (
        <Pressable
          onPress={onItemPress ? () => onItemPress(item) : undefined}
          className="mb-3 rounded-2xl border border-neutral-200 bg-white p-4"
        >
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900">
                {title}
              </Text>
              <Text className="mt-1 text-xs text-neutral-600">
                {item.category} • {formatCurrency(value)}
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${
                sold ? "bg-emerald-100" : "bg-neutral-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  sold ? "text-emerald-800" : "text-neutral-700"
                }`}
              >
                {sold ? "Sold" : "Stored"}
              </Text>
            </View>
          </View>

          {!!item.details && (
            <Text className="mt-3 text-sm text-neutral-700" numberOfLines={2}>
              {item.details}
            </Text>
          )}

          <View className="mt-3 flex-row items-center justify-between">
            <Text className="text-[11px] text-neutral-500">
              Range: {formatCurrency(item.resale_price_min)} -{" "}
              {formatCurrency(item.resale_price_max)}
            </Text>
            {!!item.created_at && (
              <Text className="text-[11px] text-neutral-500">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            )}
          </View>
        </Pressable>
      );
    },
    [onItemPress]
  );

  return (
    <View className="w-full flex-1 px-4 pt-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-neutral-900">
          Your items
        </Text>
        <Text className="text-sm text-neutral-600">{items.length}</Text>
      </View>

      <FlatList
        data={sortedItems}
        keyExtractor={(item, index) =>
          item.id ?? `${item.detected_item}-${index}`
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <View className="rounded-2xl border border-neutral-200 bg-white p-5">
            <Text className="text-base font-semibold text-neutral-900">
              No items yet
            </Text>
            <Text className="mt-2 text-sm text-neutral-600">
              Scan something to add it to your inventory.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default UserItems;
