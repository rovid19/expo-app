import React from "react";
import { TouchableOpacity, View, Image, TextInput } from "react-native";
import { Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { leftArrow, plusOutline } from "../../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import { useItems2Store } from "../../../stores/items2Store";
import { useListingDetailsStore } from "../../../stores/listingDetailsStore";

const EditListing = () => {
  const { findSelectedItem } = useItems2Store();
  const { setIsAdditionalPhotosModalVisible, setIsEditListingModalVisible } =
    useListingDetailsStore();
  const item = findSelectedItem();

  if (!item) return null;

  return (
    <View className="flex-1 relative pt-12 bg-dark1 px-6 pt-20 pb-8">
      <View className="flex flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className="text-light2 font-sans text-3xl">Edit Listing</Text>
        </View>
        <View className=" flex justify-end items-end">
          <TouchableOpacity
            className="bg-accent2 rounded-full px-4 py-2 flex flex-row items-center gap-2"
            onPress={() => {
              setIsEditListingModalVisible(false);
            }}
          >
            <SvgXml xml={leftArrow} width={24} height={24} color="#E6E6E6" />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerClassName="flex flex-col gap-4 mt-4 pb-6"
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        extraScrollHeight={120}
        enableResetScrollToCoords={false}
      >
        {/* Photos */}
        <View className="flex flex-col gap-4 bg-dark2 rounded-3xl p-4 w-full">
          <Text className="text-light2 font-sans text-2xl">Photos</Text>

          <View className="flex flex-row items-center gap-2">
            {item.image?.map((image) => (
              <View key={image} className="w-32 h-32 rounded-3xl bg-dark1">
                <Image
                  source={{ uri: image }}
                  className="w-full h-full rounded-3xl"
                />
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              setIsEditListingModalVisible(false);
              setIsAdditionalPhotosModalVisible(true);
            }}
            className="flex flex-row items-center justify-center gap-2 bg-dark1 rounded-3xl py-4 px-4"
          >
            <SvgXml xml={plusOutline} width={16} height={16} color="#E6E6E6" />
            <Text className="text-light2 font-sans text-md">Add photos</Text>
          </TouchableOpacity>
        </View>

        {/* NAME */}
        <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
          <Text className="text-light2 font-sans text-2xl">Name</Text>
          <TextInput
            className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
            placeholder={item.detected_item}
            placeholderTextColor="#999999"
          />
        </View>

        {/* PRICE */}
        <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
          <Text className="text-light2 font-sans text-2xl">Price</Text>
          <TextInput
            className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
            placeholder={String(item.price)}
            placeholderTextColor="#999999"
            keyboardType="numeric"
          />
        </View>

        {/* DESCRIPTION */}
        <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
          <Text className="text-light2 font-sans text-2xl">Description</Text>
          <TextInput
            className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
            placeholder={item.details}
            placeholderTextColor="#999999"
            multiline
            textAlignVertical="top"
            numberOfLines={4}
            scrollEnabled
          />
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        className="w-full bg-accent1 flex flex-row items-center justify-center p-4 rounded-3xl gap-2"
        onPress={() => {
          setIsEditListingModalVisible(false);
        }}
      >
        <Text className="text-lg font-bold text-dark1">Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditListing;
