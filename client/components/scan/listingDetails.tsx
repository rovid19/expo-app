import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { useItemsStore } from "../../stores/itemsStore";
import AddAdditionalImages from "./addAdditionalImages";
import FacebookMarketplacePost from "./FacebookMarketplacePost";
import { useUserStore } from "../../stores/userStore";

interface ListingDetailsProps {
  onClose: () => void;
}

const ListingDetails: React.FC<ListingDetailsProps> = ({ onClose }) => {
  const {
    selectedScannedItem,
    scannedItems,
    containerIndex,
    updateScannedItem,
  } = useItemsStore();
  const { currency } = useUserStore();

  const [isAddImageModalVisible, setIsAddImageModalVisible] = useState(false);
  const [isFacebookModalVisible, setIsFacebookModalVisible] = useState(false);

  if (!selectedScannedItem) return null;

  const {
    detected_item,
    details,
    resale_price_min,
    resale_price_max,
    confidence,
    image,
  } = selectedScannedItem;

  const handleFieldUpdate = (
    field: keyof typeof selectedScannedItem,
    value: any
  ) => {
    const updatedItem = { ...selectedScannedItem, [field]: value };
    updateScannedItem(containerIndex, updatedItem);
  };

  const scrollViewRef = useRef<ScrollView>(null);
  const descriptionRef = useRef<View>(null);

  const handleDescriptionFocus = () => {
    setTimeout(() => {
      descriptionRef.current?.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y + 200, animated: true });
        },
        () => {}
      );
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Listing Details</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={true}
        >
          {/* Photos section */}
          <View style={styles.card}>
            <Text style={styles.label}>PHOTOS & VIDEOS</Text>
            <View style={styles.photosRow}>
              <TouchableOpacity
                style={styles.addPhotoButton}
                onPress={() => setIsAddImageModalVisible(true)}
              >
                <Text style={styles.addPhotoText}>+</Text>
              </TouchableOpacity>
              {Array.isArray(image) ? (
                image.map((uri) => (
                  <Image
                    source={{ uri }}
                    style={styles.photoThumbnail}
                    resizeMode="cover"
                  />
                ))
              ) : (
                <Image
                  source={{ uri: image }}
                  style={styles.photoThumbnail}
                  resizeMode="cover"
                />
              )}
            </View>
          </View>

          {/* Product title */}
          <View style={styles.card}>
            <Text style={styles.label}>PRODUCT</Text>
            <TextInput
              style={styles.titleInput}
              value={detected_item}
              onChangeText={(value) =>
                handleFieldUpdate("detected_item", value)
              }
              placeholder="Product name"
              placeholderTextColor="#6B7280"
            />
          </View>

          {/* Price range */}
          <View style={styles.card}>
            <View style={styles.priceRow}>
              <View style={styles.priceEstimate}>
                <Text style={styles.priceLabel}>Estimated resale value</Text>
                <Text style={styles.priceRangeText}>
                  {currency === "euro"
                    ? `€${resale_price_min.toFixed(
                        0
                      )} – €${resale_price_max.toFixed(0)}`
                    : `$${resale_price_min.toFixed(
                        0
                      )} – $${resale_price_max.toFixed(0)}`}
                </Text>
              </View>
              <View style={styles.confidencePill}>
                <Text style={styles.confidenceText}>
                  {(confidence * 100).toFixed(0)}% match
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.listingPriceContainer}>
              <Text style={styles.priceLabel}>Your listing price</Text>
              <View style={styles.priceInputWrapper}>
                <Text style={styles.dollarSign}>$</Text>
                <TextInput
                  style={styles.priceInput}
                  value={resale_price_min.toString()}
                  onChangeText={(value) => {
                    const numValue = parseFloat(value) || 0;
                    handleFieldUpdate("resale_price_min", numValue);
                  }}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#6B7280"
                />
              </View>
            </View>
          </View>

          {/* Description / details */}
          <View style={styles.card} ref={descriptionRef}>
            <Text style={styles.label}>DESCRIPTION</Text>
            <TextInput
              style={styles.descriptionInput}
              value={details}
              onChangeText={(value) => handleFieldUpdate("details", value)}
              placeholder="Add description"
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              onFocus={handleDescriptionFocus}
            />
          </View>
        </ScrollView>

        {/* Primary action */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            Keyboard.dismiss();
            setIsFacebookModalVisible(true);
          }}
        >
          <Text style={styles.primaryButtonText}>Sell this item</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isAddImageModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsAddImageModalVisible(false)}
      >
        <AddAdditionalImages onClose={() => setIsAddImageModalVisible(false)} />
      </Modal>

      <Modal
        visible={isFacebookModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFacebookModalVisible(false)}
      >
        <FacebookMarketplacePost
          listing={selectedScannedItem}
          onClose={() => setIsFacebookModalVisible(false)}
        />
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  sheet: {
    backgroundColor: "#020617",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerSpacer: {
    width: 32,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E5E7EB",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#9CA3AF",
    fontSize: 16,
  },
  content: {
    flexShrink: 1,
  },
  contentInner: {
    gap: 12,
    paddingTop: 4,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#111827",
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
  },
  titleInput: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F9FAFB",
    padding: 0,
    margin: 0,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceEstimate: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  priceRangeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  divider: {
    height: 1,
    backgroundColor: "#374151",
    marginVertical: 12,
  },
  listingPriceContainer: {
    gap: 8,
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dollarSign: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
  },
  priceInput: {
    fontSize: 28,
    fontWeight: "700",
    color: "#F9FAFB",
    flex: 1,
    padding: 0,
  },
  confidencePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#111827",
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#A5B4FC",
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: "#D1D5DB",
  },
  descriptionInput: {
    fontSize: 13,
    lineHeight: 18,
    color: "#D1D5DB",
    minHeight: 60,
    padding: 0,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: "#A3E635",
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  photosRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#374151",
  },
  addPhotoText: {
    fontSize: 32,
    color: "#9CA3AF",
    fontWeight: "300",
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
});

export default ListingDetails;
