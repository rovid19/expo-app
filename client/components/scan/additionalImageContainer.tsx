import React from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useItems2Store } from "../../stores/items2Store";
import { thrash } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";

interface AdditionalImageContainerProps {
  uri: string;
}

const AdditionalImageContainer: React.FC<AdditionalImageContainerProps> = ({
  uri,
}) => {
  const { updateItemImages } = useItems2Store();

  return (
    <View className="relative h-[100px] w-[100px] rounded-lg overflow-hidden bg-dark2/100">
      <BlurView
        intensity={10}
        tint="dark"
        className="absolute inset-0 rounded-lg overflow-hidden"
      ></BlurView>
      <Image
        source={{ uri }}
        resizeMode="cover"
        className="h-full w-full rounded-lg"
      />

      <TouchableOpacity
        onPress={() => updateItemImages(uri, "remove")}
        className="absolute top-0 right-0 p-2 rounded-bl-md bg-danger items-center justify-center"
      >
        <SvgXml xml={thrash} width={16} height={16} color="#E6E6E6" />
      </TouchableOpacity>
    </View>
  );
};

export default AdditionalImageContainer;
