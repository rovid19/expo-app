import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Linking,
  TouchableOpacity,
} from "react-native";
import api from "../../lib/axios";
import { useItems2Store } from "../../stores/items2Store";
import { maximizeIcon, minimizeIcon } from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";
import Loader from "../app/loader";
interface SimilarListingsProps {
  openSimilarListings: boolean;
  setOpenSimilarListings: (openSimilarListings: boolean) => void;
}

const SimilarListings = ({
  openSimilarListings,
  setOpenSimilarListings,
}: SimilarListingsProps) => {
  const [similarListings, setSimilarListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const item = useItems2Store().findSelectedItem();

  useEffect(() => {
    getSimilarListingData();
  }, []);

  const getSimilarListingData = async () => {
    setIsLoading(true);
    const response = await api.post(
      `${process.env.EXPO_PUBLIC_API_URL}/ebay/get-similar-listings`,
      {
        itemName: item?.ebay_search_query,
      },
    );

    setSimilarListings(response.data.items ?? []);
    setIsLoading(false);
  };

  const openListing = async (url?: string) => {
    if (!url) return;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View className="flex-1 gap-4">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-3xl text-sans text-light2">Similar Listings</Text>
        <TouchableOpacity
          onPress={() => setOpenSimilarListings(!openSimilarListings)}
          className="bg-dark3 rounded-full px-4 py-2 flex flex-row items-center gap-2"
        >
          <SvgXml
            xml={openSimilarListings ? minimizeIcon : maximizeIcon}
            width={24}
            height={24}
            color="#E6E6E6"
          />
        </TouchableOpacity>
      </View>
      {!isLoading ? (
        <>
          <ScrollView
            className="w-full"
            contentContainerClassName="flex flex-col gap-3"
          >
            {similarListings.map((item, index) => {
              const title = item.title ?? "Unknown item";
              const price = item.price?.value ? `$${item.price.value}` : "N/A";

              // Browse API has no description → derive from title
              const description =
                title.length > 90 ? `${title.slice(0, 90)}…` : title;

              const imageUrl = item.image?.imageUrl;
              const listingUrl = item.itemWebUrl;

              return (
                <View
                  key={item.itemId ?? index}
                  className="flex flex-col gap-2 rounded-3xl bg-dark2"
                >
                  <View className="flex flex-row w-full">
                    {/* IMAGE (40%) */}
                    <View className="w-[40%] rounded-l-3xl flex-1 ">
                      <Pressable
                        className="flex-1"
                        disabled={!listingUrl}
                        onPress={() => openListing(listingUrl)}
                      >
                        {imageUrl && (
                          <Image
                            source={{ uri: imageUrl }}
                            className="flex-1 object-cover rounded-l-2xl"
                          />
                        )}
                      </Pressable>
                    </View>

                    {/* TEXT (60%) */}
                    <View className="w-[60%] p-4 flex flex-col gap-2 px-6">
                      <Text className="text-lg text-sans text-light2">
                        {title}
                      </Text>

                      <Text className="text-md text-sans text-light3">
                        {description.slice(0, 20)}...
                      </Text>

                      <Text className="text-3xl font-bold text-light2">
                        {price}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </>
      ) : (
        <View className="flex-1 justify-center items-center bg-dark2 rounded-3xl p-4">
          <Loader text="Loading similar listings" />
        </View>
      )}
    </View>
  );
};

export default SimilarListings;
