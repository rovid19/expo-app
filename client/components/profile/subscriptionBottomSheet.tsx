import { View, Text, Pressable } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, forwardRef } from "react";

const SubscriptionBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const snapPoints = useMemo(() => ["85%"], []);

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
    >
      <BottomSheetView className="flex-1 px-4">
        {/* Header */}

        {/* Content */}
        <View className="flex-1">
          <Text className="text-light2 font-sans">
            Subscription details go here.
          </Text>
        </View>

        {/* CTA */}
        <Pressable className="bg-accent1 py-4 rounded-full mb-4 mt-4">
          <Text className="text-dark1 text-center font-bold">Subscribe</Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default SubscriptionBottomSheet;
