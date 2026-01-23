import { View, Text, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Item } from "../../../globalTypes";
import { supabase } from "../../../services/supabase/supabaseClient";
import { useUserStore } from "../../../stores/userStore";
//import { useItemsStore } from "../../../stores/itemsStore";
import Header from "../../../components/home/header";
import Overview from "../../../components/home/overview";
import Collection from "../../../components/home/collection";
import { TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { settingsIcon } from "../../../assets/icons/icons";
import BottomSheet from "@gorhom/bottom-sheet";
import ListingDetailsBottomSheet from "../../../components/listingDetails/index";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSwipePager } from "../../../hooks/home/useSwipe";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useItems2Store } from "../../../stores/items2Store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("overview");
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  //const [isListingDetailsVisible, setIsListingDetailsVisible] = useState(false);
  const { user, triggerDashboardRefresh } = useUserStore();
  /*const { setSelectedScannedItem, setContainerIndex, setIsLoading } =
    useItemsStore();*/
  const { fetchItems, setItemType } = useItems2Store();
  const {
    overviewStyle,
    collectionStyle,
    overviewBgStyle,
    collectionBgStyle,
    overviewTextStyle,
    collectionTextStyle,
    swipeGesture,
    goToTab,
  } = useSwipePager(setCurrentTab);

  useFocusEffect(
    useCallback(() => {
      setItemType("listed");
      fetchItems();
    }, [])
  );
  const tabBarHeight = useBottomTabBarHeight();
  const listingDetailsBottomSheetRef = useRef<BottomSheet>(null);

  console.log("tabBarHeight", tabBarHeight);

  return (
    <View className="flex-1 pt-20 flex flex-col gap-4 bg-dark1 ">
      <View
        className="flex-1 items-center justify-center px-8 flex flex-col gap-8 mb-8"
        style={{ paddingBottom: tabBarHeight + 2 }}
      >
        <View className="w-full flex flex-col gap-4">
          <Header />
          <View className="flex flex-row px-4 justify-between w-full items-center ">
            <View className="flex flex-row gap-2 ">
              <Pressable
                onPress={() => goToTab("overview")}
                className="relative px-6 py-3 rounded-full overflow-hidden"
              >
                <Animated.View
                  style={[overviewBgStyle]}
                  className="absolute inset-0 bg-accent2 rounded-full"
                />

                <Animated.Text
                  style={overviewTextStyle}
                  className="font-medium text-md"
                >
                  Overview
                </Animated.Text>
              </Pressable>

              <Pressable
                onPress={() => goToTab("collection")}
                className="relative px-6 py-3 rounded-full overflow-hidden"
              >
                <Animated.View
                  style={[collectionBgStyle]}
                  className="absolute inset-0 bg-accent2 rounded-full"
                />

                <Animated.Text
                  style={collectionTextStyle}
                  className="font-medium text-md"
                >
                  Your collection
                </Animated.Text>
              </Pressable>
            </View>
            <TouchableOpacity className="flex items-center justify-center">
              <SvgXml
                xml={settingsIcon}
                width={24}
                height={24}
                color="#999999"
              />
            </TouchableOpacity>
          </View>
        </View>

        <GestureDetector gesture={swipeGesture}>
          <View className="flex-1 w-full overflow-hidden mb-8">
            <Animated.View
              style={[overviewStyle]}
              className="absolute w-full h-full flex flex-col gap-2"
            >
              <Overview />
            </Animated.View>

            <Animated.ScrollView
              style={[{ flex: 1 }, collectionStyle]}
              className="absolute w-full h-full flex-1 flex-col gap-2"
              contentContainerStyle={{ flexGrow: 1, gap: 8 }}
            >
              <Collection
                openListingDetails={() => {
                  listingDetailsBottomSheetRef.current?.snapToIndex(0);
                }}
              />
            </Animated.ScrollView>
          </View>
        </GestureDetector>
      </View>

      <ListingDetailsBottomSheet ref={listingDetailsBottomSheetRef} />
    </View>
  );
}
