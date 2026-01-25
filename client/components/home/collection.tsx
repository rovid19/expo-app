import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { rightArrow } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import Item from "./item";
import { useItems2Store } from "../../stores/items2Store";

const collection = () => {
  const { items } = useItems2Store();
  return (
    <>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </>
  );
};

export default collection;
