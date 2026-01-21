import { View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useMemo, forwardRef } from "react";
import { useAppStore } from "../../stores/appStore";
import SimilarListings from "./similarListings";
import ListingInfo from "./listingInfo";
import ListingHeader from "./listingHeader";
import ListingActions from "./listingActions";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";

const ListingDetailsBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const { setHideNavbar } = useAppStore();
  const snapPoints = useMemo(() => ["85%"], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose={true}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={true}
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
      <BottomSheetView className="w-full h-full relative px-8 py-4">
        {/* MAIN CONTENT */}
        <View className="flex-1 flex flex-col gap-8">
          <ListingHeader />

          <ListingInfo />
          <SimilarListings />

          <View className="w-full gap-2 mb-4">
            <ListingActions />
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ListingDetailsBottomSheet;
