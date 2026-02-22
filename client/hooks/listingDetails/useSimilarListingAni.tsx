import { useEffect, useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const useSimilarListingAni = () => {
  const [openSimilarListings, setOpenSimilarListings] = useState(false);
  const [hideListingInfo, setHideListingInfo] = useState(false);
  const listingInfoOpacity = useSharedValue(1);

  useEffect(() => {
    if (openSimilarListings) {
      listingInfoOpacity.value = withTiming(0, { duration: 150 });
      setHideListingInfo(true);
    } else {
      setHideListingInfo(false);
      setTimeout(() => {
        listingInfoOpacity.value = withTiming(1, { duration: 150 });
      }, 150);
    }
  }, [openSimilarListings]);

  const listingInfoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: listingInfoOpacity.value,
  }));

  return {
    openSimilarListings,
    setOpenSimilarListings,
    hideListingInfo,
    setHideListingInfo,
    listingInfoAnimatedStyle,
  };
};
