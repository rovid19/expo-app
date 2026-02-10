import Item from "./item";
import { useItems2Store } from "../../stores/items2Store";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { emptyIcon, plusOutline } from "../../assets/icons/icons";
import Button from "../app/button";
import { router } from "expo-router";

const collection = () => {
  const { items } = useItems2Store();
  return (
    <>
      {items.length > 0 ? (
        items.map((item) => <Item key={item.id} item={item} />)
      ) : (
        <View className="w-full  justify-center items-center bg-dark2 rounded-3xl p-6 flex-row gap-4">
          <View className="flex h-full">
            <SvgXml xml={emptyIcon} width={32} height={32} color="#999999" />
          </View>
          <View className="flex-1 flex flex-col gap-2">
            <Text className="text-light2 text-lg font-bold">
              No items saved.
            </Text>
            <Button
              padding={4}
              title="Scan Items"
              onPress={() => {
                router.push("/scan");
              }}
              backgroundColor="bg-dark3"
              textColor="light2"
              icon={plusOutline}
              iconSize={16}
              iconColor="#E6E6E6"
            />
          </View>
        </View>
      )}
    </>
  );
};

export default collection;
