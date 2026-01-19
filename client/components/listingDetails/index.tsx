import { View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { useMemo, forwardRef, useRef, useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import SimilarListings from "./similarListings";
import ListingInfo from "./listingInfo";
import ListingHeader from "./listingHeader";
import ListingActions from "./listingActions";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";
import EditListing from "./editListing";
import { useItemsStore } from "../../stores/itemsStore";

const ListingDetailsBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const { setHideNavbar } = useAppStore();
  const snapPoints = useMemo(() => ["85%"], []);
  const { isEditDetails } = useListingDetailsStore();

  // Facebook modal ref
  const facebookSheetRef = useRef<BottomSheetModal>(null);

  return (
    <>
      {/* MAIN LISTING SHEET */}
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
        <BottomSheetView className="w-full px-8 py-4 h-full flex flex-col gap-8">
          {/* Listing Details */}
          <View className="flex flex-col gap-2 flex-1 w-full">
            <ListingHeader />
            {!isEditDetails ? (
              <>
                <ListingInfo />
                <SimilarListings />
              </>
            ) : (
              <EditListing />
            )}
          </View>

          {/* Listing Actions */}
          <View className="w-full gap-2 mb-4">
            <ListingActions />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
});

export default ListingDetailsBottomSheet;
