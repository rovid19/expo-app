import { View, Text, Pressable } from "react-native";
import { useState, useEffect, useRef } from "react";
import { ScannedItem } from "../../../globalTypes";
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

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("overview");
  const [userItems, setUserItems] = useState<ScannedItem[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  //const [isListingDetailsVisible, setIsListingDetailsVisible] = useState(false);
  const { user, triggerDashboardRefresh } = useUserStore();
  /*const { setSelectedScannedItem, setContainerIndex, setIsLoading } =
    useItemsStore();*/
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

  const listingDetailsBottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      console.log("fetching user items");
      //setIsLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("owner_id", user?.id);
      if (error) {
        console.error("Error fetching user items:", error);
      } else {
        setUserItems((data ?? []) as ScannedItem[]);
      }
      // setIsLoading(false);
    };
    fetchUserItems();
  }, [triggerRefresh, user?.id, triggerDashboardRefresh]);

  return (
    <View className="flex-1 pt-20 flex flex-col gap-4 bg-dark1">
      <View className="flex-1 items-center justify-center px-8 flex flex-col gap-12">
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
          <View className="flex-1 w-full overflow-hidden">
            <Animated.View
              style={[overviewStyle]}
              className="absolute w-full h-full flex flex-col gap-2"
            >
              <Overview />
            </Animated.View>

            <Animated.View
              style={[collectionStyle]}
              className="absolute w-full h-full flex flex-col gap-2"
            >
              <Collection
                openListingDetails={() => {
                  listingDetailsBottomSheetRef.current?.snapToIndex(0);
                }}
              />
            </Animated.View>
          </View>
        </GestureDetector>
      </View>

      <ListingDetailsBottomSheet ref={listingDetailsBottomSheetRef} />
    </View>
  );
}
