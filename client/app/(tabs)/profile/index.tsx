import { View, Text } from "react-native";
import ProfileActions from "../../../components/profile/profileActions";
import ProfileCard from "../../../components/profile/profileCard";
import { useRef } from "react";
import SubscriptionBottomSheet from "../../../components/profile/subscriptionBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import ReportBottomSheet from "../../../components/profile/reportBottomSheet";

export default function Profile() {
  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);
  const reportBottomSheetRef = useRef<BottomSheet>(null);
  return (
    <View className="flex flex-col flex-1 items-center  bg-neutral-50 p-4">
      {/* Header */}
      <View className="w-full h-24 "></View>
      <Text className="text-4xl font-bold tracking-tight text-neutral-950 self-start ">
        Profile
      </Text>
      <Text className="text-sm text-neutral-500 mb-4 self-start tracking-tight">
        Manage your account and settings.
      </Text>

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
