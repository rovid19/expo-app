import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";

interface HeaderProps {
  title: string;
  svg: string;
}

const header = ({ title, svg }: HeaderProps) => {
  return (
    <View className="flex flex-row items-end justify-between w-full py-2">
      <Text className="text-light3 font-bold text-md">{title}</Text>

      <SvgXml xml={svg} color="#999999" />
    </View>
  );
};

export default header;
