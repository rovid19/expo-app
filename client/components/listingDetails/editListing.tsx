import React from "react";
import {
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Text } from "react-native";
import { downloadIcon, plusOutline } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";

const EditListing = () => {
  return (
    <ScrollView contentContainerClassName="flex flex-col gap-4 mt-4">
      {/*Photos*/}
      <View className="flex flex-col gap-4 bg-dark2 rounded-3xl p-4 w-full">
        <View className="flex flex-row items-center justify-between">
          <Text className="text-light2 font-sans text-2xl">Photos</Text>
          <TouchableOpacity className="flex flex-row items-center justify-center gap-2 bg-dark1 rounded-3xl py-2 px-4">
            <SvgXml xml={plusOutline} width={16} height={16} color="#E6E6E6" />
            <Text className="text-light2 font-sans text-md">Add Photo</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex flex-row items-center gap-2"
        >
          <View className="w-32 h-32 rounded-3xl bg-dark1"></View>
          <View className="w-32 h-32 rounded-3xl bg-dark1"></View>
          <View className="w-32 h-32 rounded-3xl bg-dark1"></View>
          <View className="w-32 h-32 rounded-3xl bg-dark1"></View>
          <View className="w-32 h-32 rounded-3xl bg-dark1"></View>
        </ScrollView>
        <TouchableOpacity className="w-full bg-dark1 rounded-3xl p-2 flex flex-row items-center justify-center gap-2">
          <SvgXml xml={downloadIcon} width={16} height={16} color="#E6E6E6" />
          <Text className="text-light2 font-sans text-lg">Download Photos</Text>
        </TouchableOpacity>
      </View>

      {/*Listing Details*/}
      <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
        <Text className="text-light2 font-sans text-2xl">Name</Text>
        <TextInput
          className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
          placeholder="Enter item name"
          placeholderTextColor="#999999"
        />
      </View>

      <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
        <Text className="text-light2 font-sans text-2xl">Price</Text>
        <TextInput
          className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
          placeholder="Enter item price"
          placeholderTextColor="#999999"
        />
      </View>

      <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
        <Text className="text-light2 font-sans text-2xl">Description</Text>
        <TextInput
          className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
          placeholder="Enter item price"
          placeholderTextColor="#999999"
        />
      </View>
    </ScrollView>
  );
};

export default EditListing;
