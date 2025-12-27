import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useItemsStore } from "../../stores/itemsStore";

interface AdditionalImageContainerProps {
  uri: string;
}

const AdditionalImageContainer: React.FC<AdditionalImageContainerProps> = ({
  uri,
}) => {
  const { removePhoto } = useItemsStore();

  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePhoto(uri)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#111827",
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AdditionalImageContainer;
