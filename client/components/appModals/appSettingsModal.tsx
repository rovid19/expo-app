import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useAppStore } from "../../stores/appStore";
import * as DropdownMenu from "zeego/dropdown-menu";
import { AppService } from "../../services/appService";
import { useUserStore } from "../../stores/userStore";

const AppSettingsModal = () => {
  const { setIsModal } = useAppStore();
  const { currency, setCurrency } = useAppStore();
  const { user } = useUserStore();

  const updateCurrency = async (currency: string) => {
    setCurrency(currency);
    await AppService.updateUserExtra(user?.id, { currency });
  };

  return (
    <View className="flex-1 justify-center items-center bg-dark1/50 rounded-3xl w-full relative px-4">
      <BlurView intensity={20} tint="dark" className="absolute inset-0" />

      <Pressable
        onPress={() =>
          setIsModal({ visible: false, content: null, popupContent: null })
        }
        className="absolute inset-0"
      />

      <View className="bg-dark2 rounded-3xl w-full p-8">
        <Text className="text-light2 text-2xl font-bold mb-2">
          App Currency:
        </Text>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <Pressable className="bg-dark1 rounded-xl p-4 flex-row justify-between items-center">
              <Text className="text-light2 text-lg">{currency}</Text>
              <Text className="text-light2 text-lg">▼</Text>
            </Pressable>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            side="bottom"
            align="start"
            className="bg-dark1 rounded-xl overflow-hidden"
          >
            <DropdownMenu.Item
              key="USD"
              onSelect={() => updateCurrency("USD")}
              className="p-4 border-b border-dark2"
            >
              <DropdownMenu.ItemTitle className="text-light2 text-lg">
                USD
              </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              key="EUR"
              onSelect={() => updateCurrency("EUR")}
              className="p-4"
            >
              <DropdownMenu.ItemTitle className="text-light2 text-lg">
                EUR
              </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </View>
    </View>
  );
};

export default AppSettingsModal;
