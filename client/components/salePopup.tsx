import { Linking, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { ebayIcon, facebookIcon, thrash } from "../assets/icons/icons";
import { useListingDetailsStore } from "../stores/listingDetailsStore";
import { usePopupStore } from "../stores/popupStore";
import { useUserStore } from "../stores/userStore";
import api from "../lib/axios";

const SalePopup = () => {
  const { close } = usePopupStore();
  const { setIsFacebookModalVisible } = useListingDetailsStore();
  const { user } = useUserStore();

  const handleSellOnEbay = async () => {
    const checkEbayConnection = await api.get(
      `/ebay/has-ebay-connection?userId=${user?.id}`
    );

    if (checkEbayConnection.data.hasEbayConnection) {
      console.log("user has ebay connection");
    } else {
      console.log("user does not have ebay connection");
      const response = await api.get(`/ebay/oauth-start?userId=${user?.id}`);
      Linking.openURL(response.data.authUrl);
    }
  };

  return (
    <>
      <View className="  rounded-3xl gap-4">
        <Text className="text-light2 text-2xl font-bold text-center mb-2">
          Actions
        </Text>
        <TouchableOpacity
          onPress={() => {
            console.log("selling on facebook");
            close();
            setIsFacebookModalVisible(true);
          }}
          className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
        >
          <SvgXml xml={facebookIcon} width={24} height={24} color="#E6E6E6" />
          <Text className="text-light2 text-lg font-sans">
            Sell on facebook
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSellOnEbay}
          className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2"
        >
          <SvgXml xml={ebayIcon} width={24} height={24} color="#E6E6E6" />
          <Text className="text-light2 text-lg font-sans">Sell on ebay</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SalePopup;
