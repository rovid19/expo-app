import { View, Modal } from "react-native";
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
  const { user } = useUserStore();
  const { setSelectedScannedItem, setContainerIndex } = useItemsStore();
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!user?.id) {
        setUserItems([]);
        return;
      }
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("owner_id", user?.id);
      if (error) {
        console.error("Error fetching user items:", error);
      } else {
        setUserItems((data ?? []) as ScannedItem[]);
      }
    };
    fetchUserItems();
  }, [triggerRefresh, user?.id]);

  const handleOpenItem = (item: ScannedItem) => {
    setContainerIndex(0);
    setSelectedScannedItem(item);
    setIsListingDetailsVisible(true);
  };

  const handleCloseListingDetails = () => setIsListingDetailsVisible(false);

  return (
    <View className="flex-1 bg-neutral-50 pt-20">
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
