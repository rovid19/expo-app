import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { rightArrow } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import Item from "./item";

interface HeaderProps {
  openListingDetails: () => void;
}

const collection = ({ openListingDetails }: HeaderProps) => {
  return (
    <>
      <Item openListingDetails={openListingDetails} />
      <Item openListingDetails={openListingDetails} />
      <Item openListingDetails={openListingDetails} />
    </>
  );
};

export default collection;
