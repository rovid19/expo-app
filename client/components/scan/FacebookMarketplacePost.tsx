import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { setStringAsync } from "expo-clipboard";
import { ScannedItem } from "../../globalTypes";

interface FacebookMarketplacePostProps {
  listing: ScannedItem;
  onClose: () => void;
}

const FacebookMarketplacePost: React.FC<FacebookMarketplacePostProps> = ({
  listing,
  onClose,
}) => {
  const copyTitle = async () => {
    await setStringAsync(listing.detected_item);
  };

  const copyPrice = async () => {
    await setStringAsync(String(listing.resale_price_min));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Facebook Marketplace</Text>

        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* COPY UI */}
      <View style={styles.helper}>
        <TouchableOpacity style={styles.row} onPress={copyTitle}>
          <View>
            <Text style={styles.label}>Title</Text>
            <Text numberOfLines={1} style={styles.value}>
              {listing.detected_item}
            </Text>
          </View>
          <Text style={styles.copy}>Copy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={copyPrice}>
          <View>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.value}>{listing.resale_price_min}</Text>
          </View>
          <Text style={styles.copy}>Copy</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Tap a field in Facebook → Paste</Text>
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
  container: {
    flex: 1,
    backgroundColor: "#020617",
  },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    backgroundColor: "#020617",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#9CA3AF",
    fontSize: 18,
    fontWeight: "600",
  },
  helper: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    backgroundColor: "#020617",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  value: {
    fontSize: 14,
    color: "#F9FAFB",
    maxWidth: 240,
  },
  copy: {
    color: "#A3E635",
    fontWeight: "600",
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: "#9CA3AF",
    opacity: 0.8,
  },
  webview: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default FacebookMarketplacePost;
