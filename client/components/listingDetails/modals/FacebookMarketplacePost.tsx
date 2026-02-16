import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { setStringAsync } from "expo-clipboard";
import { StyleSheet } from "react-native";
import { useItems2Store } from "../../../stores/items2Store";

interface FacebookMarketplacePostProps {
  onClose: () => void;
}

const FacebookMarketplacePost = ({ onClose }: FacebookMarketplacePostProps) => {
  const { findSelectedItem } = useItems2Store();
  const listing = findSelectedItem();
  if (!listing) return null;

  const copyTitle = async () => {
    await setStringAsync(listing.detected_item);
  };

  const copyPrice = async () => {
    await setStringAsync(String(listing.estimated_resale_price));
  };

  return (
    <SafeAreaView className="flex-1 bg-dark1">
      {/* HEADER */}
      <View className="h-[52px] flex-row items-center justify-between px-4 border-b border-dark2 bg-dark1">
        <Text className="text-base font-semibold text-slate-50">
          Facebook Marketplace
        </Text>

        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-dark2 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-light2">✕</Text>
        </TouchableOpacity>
      </View>

      {/* COPY UI */}
      <View className="px-3 py-3 border-b border-dark2 bg-dark1">
        <TouchableOpacity
          onPress={copyTitle}
          className="flex-row items-center justify-between py-2"
        >
          <View>
            <Text className="text-xs text-light3">Title</Text>
            <Text
              numberOfLines={1}
              className="text-sm text-light2 max-w-[240px]"
            >
              {listing.detected_item}
            </Text>
          </View>
          <Text className="text-accent1 font-semibold">Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={copyPrice}
          className="flex-row items-center justify-between py-2"
        >
          <View>
            <Text className="text-xs text-light3">Price</Text>
            <Text className="text-sm text-light2">
              {listing.estimated_resale_price}
            </Text>
          </View>
          <Text className="text-accent1 font-semibold">Copy</Text>
        </TouchableOpacity>

        <Text className="mt-2 text-xs text-light3">
          Tap a field in Facebook → Paste
        </Text>
      </View>

      {/* WEBVIEW */}
      <WebView
        source={{
          uri: "https://www.facebook.com/marketplace/create/item",
        }}
        javaScriptEnabled
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/120 Safari/537.36"
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default FacebookMarketplacePost;
