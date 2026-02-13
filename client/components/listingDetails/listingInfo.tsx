import { View } from "react-native";
import { Text } from "react-native";
import ListingHeader from "./listingHeader";
import { useItems2Store } from "../../stores/items2Store";
import { useAppStore } from "../../stores/appStore";

const ListingInfo = () => {
  const { findSelectedItem } = useItems2Store();
  const { currencySymbol } = useAppStore();
  const item = findSelectedItem();
  if (!item) return null;
  return (
    <View className=" rounded-3xl gap-2 flex-1">
      <ListingHeader />
      <View className="flex  flex-col bg-dark3 rounded-3xl px-8 py-4 mt-2">
        <Text className="text-light2 font-sans text-lg">
          Est. Resell Item Price
        </Text>
        <Text className="text-light2 font-bold text-3xl">
          {currencySymbol}
          {item?.estimated_resale_price}
        </Text>
      </View>
      <View className="flex flex-row w-full rounded-3xl   ">
        {/* Buying price */}
        <View className="flex-1 flex-col gap-2 border border-dark2  rounded-l-3xl p-4 justify-center">
          <Text className="text-light3 font-sans text-lg ">Buying price</Text>
          <Text className="text-light2 font-bold text-3xl">
            {currencySymbol}
            {item.buying_price ? item.buying_price : 0}
          </Text>
        </View>
        {/* Net profit */}
        <View className="flex-1 flex-col gap-2 rounded-r-3xl p-4 justify-center bg-dark2 ">
          <Text className="text-light3 font-sans text-lg ">Net profit</Text>
          <Text className="text-accent1 font-bold text-3xl">
            {currencySymbol}
            {item.selling_price && item.buying_price
              ? item.selling_price - item.buying_price
              : 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ListingInfo;
