import { View, Text, Pressable } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, forwardRef, useCallback } from "react";

const SubscriptionBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const snapPoints = useMemo(() => ["85%"], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
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
          <Text className="text-neutral-600">
            Subscription details go here.
          </Text>
        </View>

        {/* CTA */}
        <Pressable className="bg-black py-4 rounded-full mb-4">
          <Text className="text-white text-center font-semibold">
            Subscribe
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default SubscriptionBottomSheet;
