import { View, Modal, Text } from "react-native";
import { useState, useEffect } from "react";
import { ScannedItem } from "../../../globalTypes";
import { supabase } from "../../../services/supabase/supabaseClient";
import { useUserStore } from "../../../stores/userStore";
import { useItemsStore } from "../../../stores/itemsStore";
import UserIncome from "../../../components/dashboard/userIncome";
import UserItems from "../../../components/dashboard/userItems";
import ListingDetails from "../../../components/scan/listingDetails";

export default function Dashboard() {
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
    <View className="flex-1 pt-20 flex flex-col gap-4 bg-neutral-50">
      <View className="flex-row items-center justify-center">
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
      </Modal>
    </View>
  );
}
