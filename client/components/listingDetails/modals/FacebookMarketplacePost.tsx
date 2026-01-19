import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { setStringAsync } from "expo-clipboard";
import { ScannedItem } from "../../../globalTypes";
import { StyleSheet } from "react-native";

interface FacebookMarketplacePostProps {
  listing: ScannedItem;
  onClose: () => void;
}

const FacebookMarketplacePost = ({
  listing,
  onClose,
}: FacebookMarketplacePostProps) => {
  const copyTitle = async () => {
    await setStringAsync(listing.detected_item);
  };

  const copyPrice = async () => {
    await setStringAsync(String(listing.resale_price_min));
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      {/* HEADER */}
      <View className="h-[52px] flex-row items-center justify-between px-4 border-b border-slate-800 bg-slate-950">
        <Text className="text-base font-semibold text-slate-50">
          Facebook Marketplace
        </Text>

        <TouchableOpacity
          onPress={onClose}
          className="w-8 h-8 rounded-full bg-slate-800 items-center justify-center"
        >
          <Text className="text-lg font-semibold text-slate-400">✕</Text>
        </TouchableOpacity>
      </View>

      {/* COPY UI */}
      <View className="px-3 py-3 border-b border-slate-800 bg-slate-950">
        <TouchableOpacity
          onPress={copyTitle}
          className="flex-row items-center justify-between py-2"
        >
          <View>
            <Text className="text-xs text-slate-400">Title</Text>
            <Text
              numberOfLines={1}
              className="text-sm text-slate-50 max-w-[240px]"
            >
              {listing.detected_item}
            </Text>
          </View>
          <Text className="text-lime-400 font-semibold">Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={copyPrice}
          className="flex-row items-center justify-between py-2"
        >
          <View>
            <Text className="text-xs text-slate-400">Price</Text>
            <Text className="text-sm text-slate-50">
              {listing.resale_price_min}
            </Text>
          </View>
          <Text className="text-lime-400 font-semibold">Copy</Text>
        </TouchableOpacity>

        <Text className="mt-2 text-xs text-slate-400/80">
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
