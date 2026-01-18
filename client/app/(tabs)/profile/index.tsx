import { View, Text } from "react-native";
import ProfileActions from "../../../components/profile/profileActions";
import ProfileCard from "../../../components/profile/profileCard";
import { useRef } from "react";
import SubscriptionBottomSheet from "../../../components/profile/subscriptionBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import ReportBottomSheet from "../../../components/profile/reportBottomSheet";
import Header from "../../../components/header";
import { settingsIcon } from "../../../assets/icons/icons";

export default function Profile() {
  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);
  const reportBottomSheetRef = useRef<BottomSheet>(null);
  return (
    <View className="flex-1 pt-20 flex flex-col gap-4 bg-dark1 px-8">
      {/* Header */}
      <Header title="PROFILE" svg={settingsIcon} />

      {/* Profile */}
      <ProfileCard />

      {/* Actions */}
      <ProfileActions
        onPressSubscription={() =>
          subscriptionBottomSheetRef.current?.snapToIndex(0)
        }
        onPressReport={() => reportBottomSheetRef.current?.snapToIndex(0)}
      />

      <SubscriptionBottomSheet ref={subscriptionBottomSheetRef} />
      <ReportBottomSheet ref={reportBottomSheetRef} />

      {/* Footer */}
      <View className="w-full h-36 absolute bottom-0"></View>
    </View>
  );
}
