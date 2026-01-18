import React from "react";
import { View } from "react-native";
import { Text } from "react-native";
import { ScrollView } from "react-native";

const SimilarListings = () => {
  return (
    <View className="flex-1 gap-4 mt-8 ">
      <Text className="text-3xl text-sans text-light2">Similar Listings</Text>
      <ScrollView
        className="h-full w-full"
        contentContainerClassName="flex flex-col gap-2"
      >
        <View className="flex flex-col gap-2 px-2 rounded-3xl bg-dark2 ">
          <View className="flex flex-row w-full">
            <View className="w-[40%] "></View>
            <View className="w-[60%]  p-4 flex flex-col gap-2">
              <Text className="text-lg text-sans text-light2">
                Macbook Pro M1
              </Text>
              <Text className="text-md text-sans text-light3">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor
                sit amet consectetur..
              </Text>
              <Text className="text-3xl font-bold text-light2">$400</Text>
            </View>
          </View>
        </View>

        <View className="flex flex-col gap-2 px-2 rounded-3xl bg-dark2 ">
          <View className="flex flex-row w-full">
            <View className="w-[40%] "></View>
            <View className="w-[60%]  p-4 flex flex-col gap-2">
              <Text className="text-lg text-sans text-light2">
                Macbook Pro M1
              </Text>
              <Text className="text-md text-sans text-light3">
                Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor
                sit amet consectetur..
              </Text>
              <Text className="text-3xl font-bold text-light2">$400</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SimilarListings;
