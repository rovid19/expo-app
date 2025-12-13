import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { ScannedItem as ScannedItemType } from "../../globalTypes";
import ListingDetails from "./listingDetails";
import { useItemsStore } from "../../stores/itemsStore";

interface ScannedItemProps {
  item: ScannedItemType;
  index: number;
}

const ScannedItemContainer: React.FC<ScannedItemProps> = ({ item, index }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { setSelectedScannedItem } = useItemsStore();

  const handleOpenModal = () => {
    setSelectedScannedItem(item);
    setIsModalVisible(true);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Image
            source={{
              uri: Array.isArray(item.image) ? item.image[0] : item.image,
            }}
            style={styles.thumbnail}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.detected_item}
            </Text>
            <Text style={styles.details} numberOfLines={2}>
              {item.details}
            </Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>
            ${item.resale_price_min_usd.toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.editButton} onPress={handleOpenModal}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <ListingDetails onClose={() => setIsModalVisible(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 120,
    borderRadius: 16,
    padding: 12,
    backgroundColor: "#111827",
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    gap: 10,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#374151",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F9FAFB",
    marginBottom: 4,
  },
  details: {
    fontSize: 11,
    color: "#D1D5DB",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22C55E",
  },
  editButton: {
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#F9FAFB",
  },
});

export default ScannedItemContainer;
