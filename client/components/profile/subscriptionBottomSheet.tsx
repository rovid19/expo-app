import { View, Text } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, forwardRef, useState, useEffect } from "react";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { useAppStore } from "../../stores/appStore";

const SubscriptionBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const snapPoints = useMemo(() => ["85%"], []);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const { setHideNavbar } = useAppStore();

  const activeProductId = customerInfo?.activeSubscriptions?.[0];
  const sub = activeProductId
    ? customerInfo?.subscriptionsByProductIdentifier?.[activeProductId]
    : null;

  const getCustomerInfo = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    setCustomerInfo(customerInfo);
  };

  useEffect(() => {
    getCustomerInfo();
  }, []);

  const formatDate = (iso?: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  console.log(customerInfo);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      handleIndicatorStyle={{ backgroundColor: "#262626" }}
      backgroundStyle={{
        backgroundColor: "#0D0D0D",
        borderWidth: 1,
        borderColor: "#1A1A1A",
        borderRadius: 16,
      }}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      onAnimate={(_, toIndex) => {
        if (toIndex === -1) {
          setHideNavbar(false);
        }
      }}
    >
      <BottomSheetView className="flex-1 px-6">
        {/* Header */}

        {/* Content */}
        <View className="flex-1 gap-4 pt-4">
          <View className="bg-dark2 rounded-2xl p-4 gap-6">
            <View className="flex-row justify-between">
              <Text className="text-light3 font-sans text-lg">Plan</Text>
              <Text className="text-light2 font-bold text-lg">
                {activeProductId ?? "—"}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-light3 font-sans text-lg">Started</Text>
              <Text className="text-light2 font-sans text-base">
                {formatDate(sub?.purchaseDate)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-light3 font-sans text-lg">
                Renews / Ends
              </Text>
              <Text className="text-light2 font-sans text-base">
                {formatDate(sub?.expiresDate)}
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default SubscriptionBottomSheet;
