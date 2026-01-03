import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Image } from "react-native";
import { ScannedItem as ScannedItemType } from "../../globalTypes";
import ListingDetails from "./listingDetails";
import { useItemsStore } from "../../stores/itemsStore";
import { useUserStore } from "../../stores/userStore";
import { BlurView } from "expo-blur";

interface ScannedItemProps {
  item: ScannedItemType;
  index: number;
}

const ScannedItemContainer: React.FC<ScannedItemProps> = ({ item, index }) => {
  const { currency } = useUserStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setSelectedScannedItem } = useItemsStore();
  const { setTriggerDashboardRefresh, triggerDashboardRefresh } =
    useUserStore();

  const handleOpenModal = () => {
    setSelectedScannedItem(item);
    setIsModalVisible(true);
  };

  return (
    <>
      <BlurView
        intensity={60}
        tint="dark"
        className="w-[250px] h-[120px] rounded-2xl p-3 border border-white/10 justify-between overflow-hidden"
      >
        <View className="flex-row gap-2.5 flex-1">
          <Image
            source={{
              uri: item.image?.[0] ?? "",
            }}
            className="w-[80px] h-full rounded-lg bg-gray-700"
            resizeMode="cover"
          />
          <View className="flex-1 justify-center">
            <Text
              className="text-sm font-semibold text-gray-50 mb-1"
              numberOfLines={1}
            >
              {item.detected_item}
            </Text>
            <Text className="text-[11px] text-gray-300" numberOfLines={2}>
              {item.details}
            </Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-sm font-semibold text-green-500 self-end">
                {currency === "EUR"
                  ? `€${item.resale_price_min.toFixed(2)}`
                  : `$${item.resale_price_min.toFixed(2)}`}
              </Text>
              <TouchableOpacity
                className="p-4   rounded-lg  border border-white/10 justify-center items-center"
                onPress={handleOpenModal}
              >
                <Text className="text-xs font-semibold text-gray-50">Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ListingDetails
          onClose={() => setIsModalVisible(false)}
          onSaved={() => {
            setTriggerDashboardRefresh(!triggerDashboardRefresh);
            setIsModalVisible(false);
          }}
          whichTab="scan"
        />
      </Modal>
    </>
  );
};

export default ScannedItemContainer;
