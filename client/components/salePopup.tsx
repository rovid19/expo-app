import { Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { ebayIcon, facebookIcon, thrash } from "../assets/icons/icons";
import { useListingDetailsStore } from "../stores/listingDetailsStore";
import { usePopupStore } from "../stores/popupStore";
const SalePopup = () => {
  const { close } = usePopupStore();
  const { setIsFacebookModalVisible } = useListingDetailsStore();
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
        <TouchableOpacity className="w-full flex flex-row items-center justify-center p-4 rounded-3xl gap-2 bg-dark2">
          <SvgXml xml={ebayIcon} width={24} height={24} color="#E6E6E6" />
          <Text className="text-light2 text-lg font-sans">Sell on ebay</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SalePopup;
