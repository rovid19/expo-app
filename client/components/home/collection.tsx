import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { rightArrow } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import Item from "./item";

const collection = () => {
  return (
    <>
      <Item />
      <Item />
      <Item />
      <Item />
    </>
  );
};

export default collection;
