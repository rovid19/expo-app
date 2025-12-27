import React, { useCallback, useMemo } from "react";
import { ScannedItem } from "../../globalTypes";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  Pressable,
  Image,
  Button,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { emptyBox } from "../../assets/icons/icons";
import { router } from "expo-router";
import { scanOutline } from "../../assets/icons/icons";

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
      const mainImage = item.image?.[0] ?? null;

      return (
        <Pressable
          onPress={onItemPress ? () => onItemPress(item) : undefined}
          className="mb-3 rounded-2xl border border-neutral-200 bg-white flex-row gap-4
          "
        >
          <View className="h-36 w-36 overflow-hidden rounded-l-xl bg-neutral-100">
            {mainImage ? (
              <Image
                source={{ uri: mainImage }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <View className="h-full w-full items-center justify-center">
                <Text className="text-[10px] font-semibold text-neutral-500">
                  No image
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row gap-3 flex-1 py-4 pr-4">
            <View className="flex-1">
              <View className="flex-row items-start justify-between gap-2">
                <Text
                  className="flex-1 text-base font-semibold text-neutral-900"
                  numberOfLines={1}
                >
                  {title}
                </Text>

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
                    {sold ? "Sold" : "Available"}
                  </Text>
                </View>
              </View>

              <View className="mt-1 flex-col justify-between flex-1">
                <Text className="text-xs text-neutral-600">
                  Category: {item.category}
                </Text>
                <View className="flex-1" />
                <Text className="text-xl font-bold text-neutral-900 self-end">
                  {formatCurrency(value)}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      );
    },
    [onItemPress]
  );

  return (
    <View className="w-full flex-1 px-4">
      <View className="mb-2 flex flex-row">
        <View className="flex-1 flex-row items-center justify-between ">
          <Text className="text-2xl font-bold text-neutral-900">
            Your Items
          </Text>
        </View>
      </View>

      <View className="px-2">
        <FlatList
          data={sortedItems}
          keyExtractor={(item, index) =>
            item.id ?? `${item.detected_item}-${index}`
          }
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 4 }}
          ListEmptyComponent={
            <View className="rounded-3xl bg-white p-5 bg-red-500 flex-row items-center justify-center border border-neutral-200/50">
              <View className="h-full w-[10%]">
                <SvgXml xml={emptyBox} width={24} height={24} />
              </View>

              <View className="flex-1">
                <Text className="text-base font-semibold text-neutral-900">
                  No items yet
                </Text>
                <Text className="mt-2 text-sm text-neutral-600">
                  Scan something to add it to your inventory.
                </Text>
                <Pressable
                  className="mt-4 flex-row items-center justify-center gap-1 rounded-xl bg-neutral-100 px-4 py-2 border border-neutral-200"
                  onPress={() => router.push("/scan")}
                >
                  <SvgXml xml={scanOutline} width={20} height={20} />
                  <Text className="ml-2 text-base font-semibold text-neutral-900">
                    Scan something
                  </Text>
                </Pressable>
              </View>
            </View>
          }
        />
      </View>
    </View>
  );
};

export default UserItems;
