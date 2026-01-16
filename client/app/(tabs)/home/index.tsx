import { View, Modal, Text, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { ScannedItem } from "../../../globalTypes";
import { supabase } from "../../../services/supabase/supabaseClient";
import { useUserStore } from "../../../stores/userStore";
import { useItemsStore } from "../../../stores/itemsStore";
import UserIncome from "../../../components/dashboard/userIncome";
import UserItems from "../../../components/dashboard/userItems";
import ListingDetails from "../../../components/scan/listingDetails";
import Header from "../../../components/home/header";
import Overview from "../../../components/home/overview";
import Collection from "../../../components/home/collection";
import { TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { settingsIcon } from "../../../assets/icons/icons";
import colors from "tailwindcss/colors";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState("overview");
  const [userItems, setUserItems] = useState<ScannedItem[]>([]);
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  const [isListingDetailsVisible, setIsListingDetailsVisible] = useState(false);
  const { user, triggerDashboardRefresh } = useUserStore();
  const { setSelectedScannedItem, setContainerIndex, setIsLoading } =
    useItemsStore();
  useEffect(() => {
    const fetchUserItems = async () => {
      console.log("fetching user items");
      setIsLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("owner_id", user?.id);
      if (error) {
        console.error("Error fetching user items:", error);
      } else {
        setUserItems((data ?? []) as ScannedItem[]);
      }
      setIsLoading(false);
    };
    fetchUserItems();
  }, [triggerRefresh, user?.id, triggerDashboardRefresh]);

  const handleOpenItem = (item: ScannedItem) => {
    setContainerIndex(0);
    setSelectedScannedItem(item);
    setIsListingDetailsVisible(true);
  };
  console.log("isListingDetailsVisible", isListingDetailsVisible);

  const handleCloseListingDetails = () => setIsListingDetailsVisible(false);

  return (
    <View className="flex-1 pt-20 flex flex-col gap-4 bg-dark1">
      {/*<View className="flex-row items-center justify-center">
        <Text className="text-xl text-neutral-900">Sellify</Text>
      </View>
      <UserIncome items={userItems} setTriggerRefresh={setTriggerRefresh} />
      <UserItems
        items={userItems}
        setTriggerRefresh={setTriggerRefresh}
        onItemPress={handleOpenItem}
      />

      <Modal
        visible={isListingDetailsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseListingDetails}
      >
        <ListingDetails
          onClose={handleCloseListingDetails}
          onSaved={() => setTriggerRefresh((prev) => !prev)}
          whichTab="dashboard"
        />
      </Modal>*/}

      <View className="flex-1 items-center justify-center px-8 flex flex-col gap-12">
        <View className="w-full flex flex-col gap-4">
          <Header />
          <View className="flex flex-row px-4 justify-between w-full items-center ">
            <View className="flex flex-row gap-2 ">
              <Pressable
                onPress={() => setCurrentTab("overview")}
                className={`${
                  currentTab === "overview" ? "bg-accent2" : "bg-dark1"
                } px-6 py-3 rounded-full`}
              >
                <Text
                  className={`${
                    currentTab === "overview" ? "text-light1" : "text-light3"
                  } font-medium text-md`}
                >
                  Overview
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setCurrentTab("collection")}
                className={`${
                  currentTab === "collection" ? "bg-accent2" : "bg-dark1"
                } px-6 py-3 rounded-full`}
              >
                <Text
                  className={`${
                    currentTab === "collection" ? "text-light1" : "text-light3"
                  } font-medium text-md`}
                >
                  Your collection
                </Text>
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

        <View className="flex-1 items-center w-full px-4 flex flex-col gap-2">
          {currentTab === "overview" ? <Overview /> : <Collection />}
        </View>
      </View>
    </View>
  );
}
