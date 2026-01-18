import React, { useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { rightArrow } from "../../assets/icons/icons";
import { useAppStore } from "../../stores/appStore";
interface HeaderProps {
  openListingDetails: () => void;
}

const item = ({ openListingDetails }: HeaderProps) => {
  const { setHideNavbar } = useAppStore();
  return (
    <View className="w-full flex flex-row bg-dark2 rounded-3xl ">
      {/*Image*/}
      <View className="w-[30%] h-full  rounded-l-3xl"></View>
      {/*Details*/}
      <View className="w-[70%] h-full rounded-r-3xl p-4 flex flex-col gap-3">
        {/*Item details*/}
        <View className="flex flex-col gap-2">
          {/*Item Worth*/}
          <View className="px-4 py-1 bg-dark1 ">
            <Text className="text-light2 font-sans text-lg">Worth: $300</Text>
          </View>
          {/*Item Name*/}
          <View className="px-2">
            <Text className="text-light2 font-sans text-lg">
              Macbook Pro M1 2020
            </Text>
          </View>
          {/*Item Profits*/}
          <View className="flex flex-row gap-4 px-2">
            {/*Buying price*/}
            <View className="flex flex-col gap-1">
              <Text className="text-light3 font-sans text-sm">
                Buying price:
              </Text>
              <Text className="text-light2 font-sans text-sm">$100</Text>
            </View>
            {/*net profit*/}

            <View className="flex flex-col gap-1">
              <Text className="text-light3 font-sans text-sm">Net profit:</Text>
              <Text className="text-accent1 font-sans text-sm">$100</Text>
            </View>
          </View>
        </View>

        {/*Item actions*/}
        <TouchableOpacity
          className="bg-dark3 rounded-full px-4 py-4 flex flex-row items-center justify-center gap-2 "
          onPress={() => {
            setHideNavbar(true);
            openListingDetails();
          }}
        >
          <Text className="text-light2 font-sans text-md">Edit listing</Text>
          <SvgXml
            xml={rightArrow}
            width={16}
            height={16}
            color="rgba(230,230,230,0.8)"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default item;
