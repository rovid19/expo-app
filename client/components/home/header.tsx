import React from "react";
import { View, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { logo, wavingHand } from "../../assets/icons/icons";

const header = () => {
  return (
    <>
      <View className="flex flex-row items-end justify-between w-full py-2">
        <Text className="text-light3 font-bold text-md">HOME</Text>
        <SvgXml xml={logo} />
      </View>

      <View className="flex flex-col ">
        <Text className="text-5xl font-bold font-bold text-light2">Hello,</Text>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-5xl font-bold font-bold text-light2">
            Roberto
          </Text>
          <Text className="text-4xl">👋</Text>
        </View>
      </View>
    </>
  );
};

export default header;
