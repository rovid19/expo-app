import { Linking, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { ebayIcon, facebookIcon } from "../../assets/icons/icons";
import { usePopupStore } from "../../stores/popupStore";
import { useUserStore } from "../../stores/userStore";
import api from "../../lib/axios";
import FacebookMarketplacePost from "../listingDetails/modals/FacebookMarketplacePost";
import { useAppStore } from "../../stores/appStore";
import axios from "axios";
import { useItems2Store } from "../../stores/items2Store";
import { useState } from "react";
import Loader from "../app/loader";
import toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useListingDetailsStore } from "../../stores/listingDetailsStore";
import { BlurView } from "expo-blur";

const SalePopup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsModal, closeModal } = useAppStore();
  const { closeListingDetails } = useListingDetailsStore();
  const { user } = useUserStore();
  const router = useRouter();
  const { isModal } = useAppStore();
  const { findSelectedItem } = useItems2Store();
  const item = findSelectedItem();
  if (!item) return;
  const handleSellOnEbay = async () => {
    /*setIsLoading(true);

    const checkEbayConnection = await api.get(
      `/ebay/has-ebay-connection?userId=${user?.id}`,
    );

    if (checkEbayConnection.data.hasEbayConnection) {
      await autoListOnEbay();
    } else {
      const response = await api.get(`/ebay/oauth-start?userId=${user?.id}`);
      Linking.openURL(response.data.authUrl);
    }
  };
  const autoListOnEbay = async () => {
    const formData = new FormData();

    // 1. append images
    item.image?.forEach((uri, index) => {
      formData.append("files", {
        uri: uri.startsWith("file://") ? uri : `file://${uri}`,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      } as any);
    });

    // 2. append userId
    formData.append("userId", user?.id as string);

    // 3. append item (must be string)
    formData.append("item", JSON.stringify(item));

    try {
      const response = await api.post("/ebay/auto-list-on-ebay", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
      closeModal();
    }
      */
    /* setIsModal({
      visible: true,
      content: <Loader text="Listing on ebay..." test={true} />,
      popupContent: null,
    });

    setTimeout(() => {
      setIsModal({
        visible: false,
        content: null,
        popupContent: null,
      });
      closeListingDetails();
      router.replace("/(tabs)/home");

      toast.show({
        type: "success",
        text1: "Item successfully listed on ebay",
        position: "top",
      });
    }, 2500);*/
  };

  return (
    <>
      <View className={`  rounded-3xl gap-4 ${isLoading ? "h-32" : ""}`}>
        {!isLoading ? (
          <>
            <Text className="text-light2 text-2xl font-bold text-center mb-2">
              Actions
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsModal({
                  visible: true,
                  content: (
                    <FacebookMarketplacePost onClose={() => closeModal()} />
                  ),
                  popupContent: null,
                });
              }}
              className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
            >
              <SvgXml
                xml={facebookIcon}
                width={24}
                height={24}
                color="#E6E6E6"
              />
              <Text className="text-light2 text-lg font-sans">
                Sell on facebook
              </Text>
            </TouchableOpacity>
            <View className="w-full relative">
              <View className="absolute -top-2 -right-2 bg-dark3 px-3 py-1 rounded-full z-10">
                <Text className="text-light2 text-xs font-sans font-bold">
                  Coming soon
                </Text>
              </View>
              <TouchableOpacity
                disabled
                className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2 opacity-50"
              >
                <SvgXml xml={ebayIcon} width={24} height={24} color="#E6E6E6" />
                <Text className="text-light2 text-lg font-sans">
                  Sell on ebay
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Loader text="Listing on ebay..." />
        )}
      </View>
    </>
  );
};

export default SalePopup;
