import { View, Text } from "react-native";
import ProfileActions from "../../../components/profile/profileActions";
import ProfileCard from "../../../components/profile/profileCard";
import { useRef } from "react";
import SubscriptionBottomSheet from "../../../components/profile/subscriptionBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import ReportBottomSheet from "../../../components/profile/reportBottomSheet";
import Header from "../../../components/app/header";
import { logo } from "../../../assets/icons/icons";
import { useAppStore } from "../../../stores/appStore";
import ContentContainer from "../../../components/app/contentContainer";

export default function Profile() {
  const subscriptionBottomSheetRef = useRef<BottomSheet>(null);
  const reportBottomSheetRef = useRef<BottomSheet>(null);
  const { setHideNavbar } = useAppStore();
  return (
    <View className="flex-1 pt-20 bg-dark1">
      <ContentContainer className="flex flex-col gap-4 px-6">
        {/* Header */}
        <Header title="PROFILE" />

        {/* Profile */}
        <ProfileCard />

        {/* Actions */}
        <ProfileActions
          onPressSubscription={() => {
            subscriptionBottomSheetRef.current?.snapToIndex(0);
            setHideNavbar(true);
          }}
          onPressReport={() => {
            reportBottomSheetRef.current?.snapToIndex(0);
            setHideNavbar(true);
          }}
        />

        <SubscriptionBottomSheet ref={subscriptionBottomSheetRef} />
        <ReportBottomSheet ref={reportBottomSheetRef} />

        {/* Footer */}
        <View className="w-full h-36 absolute bottom-0"></View>
      </ContentContainer>
    </View>
  );
}
