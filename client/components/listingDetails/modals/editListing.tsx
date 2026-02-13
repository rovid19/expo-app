import { useState } from "react";
import {
  TouchableOpacity,
  View,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { leftArrow, plusOutline } from "../../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import { useItems2Store } from "../../../stores/items2Store";
import { usePopupStore } from "../../../stores/popupStore";
import ConfirmationPopup from "../../popup/confirmationPopup";
import { useAppStore } from "../../../stores/appStore";
import AddAdditionalImages from "../../scan/addAdditionalImages";

const EditListing = () => {
  const [changesMade, setChangesMade] = useState(false);
  const { open } = usePopupStore();
  const { findSelectedItem, saveItem } = useItems2Store();
  const item = findSelectedItem();
  const { closeModal, setIsModal } = useAppStore();
  if (!item) return null;

  const handleExit = () => {
    if (!changesMade) {
      closeModal();
      return;
    }

    open(
      <ConfirmationPopup
        text="Are you sure you want to leave this page? You have unsaved changes."
        buttonText1="Save and exit"
        buttonText2="Exit without saving"
        popupAction={() => {
          saveItem(item);
          closeModal();
        }}
      />,
    );
  };

  return (
    <View className="flex-1 relative pt-12 bg-dark1 px-6 pt-20 pb-8">
      <View className="flex flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-light2 font-sans text-3xl">Edit Listing</Text>
        </View>
        <View className=" flex justify-end items-end">
          <TouchableOpacity
            className="bg-accent2 rounded-full px-4 py-2 flex flex-row items-center gap-2"
            onPress={() => {
              handleExit();
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

          <ScrollView
            horizontal
            contentContainerClassName="flex flex-row items-center gap-2"
          >
            {item.image?.map((image) => (
              <View key={image} className="w-32 h-32 rounded-3xl bg-dark1">
                <Image
                  source={{ uri: image }}
                  className="w-full h-full rounded-3xl"
                />
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              setIsModal({
                visible: true,
                content: <AddAdditionalImages />,
                popupContent: null,
              });
            }}
            className="flex flex-row items-center justify-center gap-2 bg-dark1 rounded-3xl py-4 px-4"
          >
            <SvgXml xml={plusOutline} width={16} height={16} color="#E6E6E6" />
            <Text className="text-light2 font-sans text-md">Add photos</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row items-center gap-2">
          {/* BUYING PRICE */}
          <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 flex-1">
            <Text className="text-light2 font-sans text-2xl">Buying Price</Text>
            <TextInput
              className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
              placeholder={item.buying_price ? String(item.buying_price) : "0"}
              placeholderTextColor="#999999"
              keyboardType="numeric"
              onChangeText={(text) => {
                setChangesMade(true);
                item.buying_price = Number(text);
              }}
            />
          </View>
          {/* SELLING PRICE */}
          <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 flex-1">
            <Text className="text-light2 font-sans text-2xl">
              Selling Price
            </Text>
            <TextInput
              className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
              placeholder={
                item.selling_price ? String(item.selling_price) : "0"
              }
              placeholderTextColor="#999999"
              keyboardType="numeric"
              onChangeText={(text) => {
                setChangesMade(true);
                item.selling_price = Number(text);
              }}
            />
          </View>
        </View>

        {/* NAME */}
        <View className="flex flex-col gap-2 bg-dark2 rounded-3xl p-4 w-full">
          <Text className="text-light2 font-sans text-2xl">Name</Text>
          <TextInput
            className="text-light2 font-sans text-lg bg-dark3 px-4 py-2 rounded-3xl"
            placeholder={item.detected_item}
            placeholderTextColor="#999999"
            onChangeText={(text) => {
              setChangesMade(true);
              item.detected_item = text;
            }}
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
            onChangeText={(text) => {
              setChangesMade(true);
              item.details = text;
            }}
          />
        </View>
      </KeyboardAwareScrollView>

      <TouchableOpacity
        className="w-full bg-accent1 flex flex-row items-center justify-center p-4 rounded-3xl gap-2"
        onPress={() => {
          saveItem(item);
          closeModal();
        }}
      >
        <Text className="text-lg font-bold text-dark1">Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditListing;
