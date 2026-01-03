import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useItemsStore } from "../../stores/itemsStore";
import { BlurView } from "expo-blur";
interface AdditionalImageContainerProps {
  uri: string;
}

const AdditionalImageContainer: React.FC<AdditionalImageContainerProps> = ({
  uri,
}) => {
  const { removePhoto } = useItemsStore();

  return (
    <BlurView
      intensity={60}
      tint="dark"
      className="h-[100px] w-[100px] rounded-lg p-3 border border-white/10 overflow-hidden"
    >
      <Image
        source={{ uri }}
        className="h-full w-full rounded-lg"
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removePhoto(uri)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </BlurView>
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
