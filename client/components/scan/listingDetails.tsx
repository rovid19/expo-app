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
  ActivityIndicator,
} from "react-native";
import { useItemsStore } from "../../stores/itemsStore";
import AddAdditionalImages from "./addAdditionalImages";
import FacebookMarketplacePost from "./FacebookMarketplacePost";
import { useUserStore } from "../../stores/userStore";
import { supabase } from "../../services/supabase/supabaseClient";
import { uploadImages } from "../../services/supabase/uploadImages";
import colors from "tailwindcss/colors";
import Loader from "../loader";
import {
  bookmark,
  check,
  ebay,
  facebook,
  moreIcon,
  shoppingCart,
  thrash,
} from "../../assets/icons/icons";
import { SvgXml } from "react-native-svg";

interface ListingDetailsProps {
  onClose: () => void;
  onSaved?: () => void;
  whichTab: "dashboard" | "scan";
}

const ListingDetails: React.FC<ListingDetailsProps> = ({
  onClose,
  onSaved,
  whichTab,
}) => {
  const {
    selectedScannedItem,
    scannedItems,
    containerIndex,
    updateScannedItem,
    setSelectedScannedItem,
    removeScannedItem,
  } = useItemsStore();
  const { currency, user } = useUserStore();

  const [isAddImageModalVisible, setIsAddImageModalVisible] = useState(false);
  const [isFacebookModalVisible, setIsFacebookModalVisible] = useState(false);
  const [isSizeDropdownVisible, setIsSizeDropdownVisible] = useState(false);
  const [removingItem, setRemovingItem] = useState(false);
  const [isShoeSizeUnitDropdownVisible, setIsShoeSizeUnitDropdownVisible] =
    useState(false);
  const [isSellOptionsModalVisible, setIsSellOptionsModalVisible] =
    useState(false);
  const [isSecondaryActionsModalVisible, setIsSecondaryActionsModalVisible] =
    useState(false);
  const [isSavingModalVisible, setIsSavingModalVisible] = useState(false);

  if (!selectedScannedItem) return null;

  const {
    detected_item,
    details,
    resale_price_min,
    resale_price_max,
    confidence,
    image,
    category,
    shoe_size,
    size,
    price,
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

  const handleSaveItem = async () => {
    setIsSavingModalVisible(true);

    const { id, created_at, ...payload } = selectedScannedItem;

    const currentImages = Array.isArray(selectedScannedItem.image)
      ? selectedScannedItem.image
      : selectedScannedItem.image
      ? [selectedScannedItem.image]
      : [];
    const uploadedImages = await uploadImages(
      currentImages,
      id ? "update" : "insert"
    );
    payload.image = uploadedImages;

    const query = id
      ? supabase.from("items").update(payload).eq("id", id).select("*")
      : supabase
          .from("items")
          .insert({ ...payload, owner_id: user?.id })
          .select("*");

    const { data, error } = await query;

    if (error) {
      console.error("Error saving item:", error);
    } else {
      console.log("Item saved successfully:", data);
      onSaved?.();
    }

    setIsSavingModalVisible(false);
  };

  const removeItemFromDatabase = async () => {
    const { id } = selectedScannedItem;
    if (!id) return;
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", id)
      .select("*");
    if (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleToggleSold = async () => {
    const itemId = selectedScannedItem.id;
    if (!itemId) return;

    const nextIsSold = !(selectedScannedItem.isSold === true);

    const { data, error } = await supabase
      .from("items")
      .update({ isSold: nextIsSold })
      .eq("id", itemId)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating sold status:", error);
      return;
    }

    setSelectedScannedItem({ ...selectedScannedItem, ...data });
    onSaved?.();
    onClose();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          onClose();
        }}
      >
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Listing Details</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={async () => {
              console.log("whichTab", whichTab);
              if (whichTab === "dashboard") {
                console.log("saving item");
                await handleSaveItem();
              }
              onClose();
            }}
          >
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.photosRow}
            >
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
                  source={{ uri: image ?? "" }}
                  style={styles.photoThumbnail}
                  resizeMode="cover"
                />
              )}
            </ScrollView>
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
                  {currency === "EUR"
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
                  value={price?.toString() || "0"}
                  onChangeText={(value) => {
                    const numValue = parseFloat(value) || 0;
                    handleFieldUpdate("price", numValue);
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

          {category === "clothes" && (
            <View style={styles.card}>
              <Text style={styles.label}>SIZE</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsSizeDropdownVisible(true)}
              >
                <Text
                  style={[
                    styles.dropdownButtonText,
                    !size && styles.dropdownButtonPlaceholder,
                  ]}
                >
                  {size ? size.toUpperCase() : "Select size"}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
              <Modal
                visible={isSizeDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsSizeDropdownVisible(false)}
              >
                <TouchableOpacity
                  style={styles.dropdownBackdrop}
                  activeOpacity={1}
                  onPress={() => setIsSizeDropdownVisible(false)}
                >
                  <View style={styles.dropdownContainer}>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((sizeOption) => {
                      const sizeOptionLower = sizeOption.toLowerCase() as
                        | "s"
                        | "m"
                        | "l"
                        | "xl"
                        | "xxl";
                      return (
                        <TouchableOpacity
                          key={sizeOption}
                          style={[
                            styles.dropdownOption,
                            size === sizeOptionLower &&
                              styles.dropdownOptionSelected,
                          ]}
                          onPress={() => {
                            handleFieldUpdate("size", sizeOptionLower);
                            setIsSizeDropdownVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              size === sizeOptionLower &&
                                styles.dropdownOptionTextSelected,
                            ]}
                          >
                            {sizeOption}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              </Modal>
            </View>
          )}
          {category === "shoes" &&
            (() => {
              const shoeSizeStr = shoe_size
                ? typeof shoe_size === "string"
                  ? shoe_size
                  : shoe_size.toString()
                : "";
              const shoeSizeParts = shoeSizeStr.split(" ");
              const shoeSizeValue = shoeSizeParts[0] || "";
              const shoeSizeUnit = shoeSizeParts[1] || "US";

              return (
                <View style={styles.card}>
                  <Text style={styles.label}>SHOE SIZE</Text>
                  <View style={styles.shoeSizeRow}>
                    <TextInput
                      style={styles.shoeSizeInput}
                      value={shoeSizeValue}
                      onChangeText={(value) => {
                        handleFieldUpdate(
                          "shoe_size",
                          `${value} ${shoeSizeUnit}`.trim()
                        );
                      }}
                      placeholder="Size"
                      placeholderTextColor="#6B7280"
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      style={styles.shoeSizeUnitButton}
                      onPress={() => setIsShoeSizeUnitDropdownVisible(true)}
                    >
                      <Text style={styles.shoeSizeUnitText}>
                        {shoeSizeUnit}
                      </Text>
                      <Text style={styles.dropdownArrow}>▼</Text>
                    </TouchableOpacity>
                  </View>
                  <Modal
                    visible={isShoeSizeUnitDropdownVisible}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() =>
                      setIsShoeSizeUnitDropdownVisible(false)
                    }
                  >
                    <TouchableOpacity
                      style={styles.dropdownBackdrop}
                      activeOpacity={1}
                      onPress={() => setIsShoeSizeUnitDropdownVisible(false)}
                    >
                      <View style={styles.dropdownContainer}>
                        {["US", "UK", "EU", "CM"].map((unit) => (
                          <TouchableOpacity
                            key={unit}
                            style={[
                              styles.dropdownOption,
                              shoeSizeUnit === unit &&
                                styles.dropdownOptionSelected,
                            ]}
                            onPress={() => {
                              handleFieldUpdate(
                                "shoe_size",
                                `${shoeSizeValue} ${unit}`.trim()
                              );
                              setIsShoeSizeUnitDropdownVisible(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownOptionText,
                                shoeSizeUnit === unit &&
                                  styles.dropdownOptionTextSelected,
                              ]}
                            >
                              {unit}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </TouchableOpacity>
                  </Modal>
                </View>
              );
            })()}
        </ScrollView>

        {/* Primary actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              Keyboard.dismiss();
              setIsSellOptionsModalVisible(true);
            }}
          >
            <SvgXml
              xml={shoppingCart}
              width={24}
              height={24}
              color={colors.white}
            />
            <Text style={styles.primaryButtonText}>Sell this item</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              Keyboard.dismiss();
              setIsSecondaryActionsModalVisible(true);
            }}
          >
            <SvgXml
              xml={moreIcon}
              width={24}
              height={24}
              color={colors.neutral[900]}
            />
            <Text style={styles.secondaryButtonText}>More actions</Text>
          </TouchableOpacity>
        </View>
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

      <Modal
        visible={isSecondaryActionsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSecondaryActionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsSecondaryActionsModalVisible(false)}
        >
          <View style={styles.sellOptionsContainer}>
            <Text style={styles.sellOptionsTitle}>Choose an action</Text>

            {whichTab === "dashboard" && (
              <TouchableOpacity
                style={styles.sellOptionButton}
                onPress={() => {
                  setIsSecondaryActionsModalVisible(false);
                  handleToggleSold();
                }}
              >
                <SvgXml
                  xml={check}
                  width={24}
                  height={24}
                  color={colors.white}
                />
                <Text style={styles.sellOptionText}>
                  {selectedScannedItem.isSold === true
                    ? "Mark as available"
                    : "Mark as sold"}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.sellOptionButton}
              onPress={() => {
                setIsSecondaryActionsModalVisible(false);
                handleSaveItem();
              }}
            >
              <SvgXml
                xml={bookmark}
                width={24}
                height={24}
                color={colors.white}
              />
              <Text style={styles.sellOptionText}>Save to your items</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sellOptionButton}
              onPress={async () => {
                setIsSecondaryActionsModalVisible(false);
                if (whichTab === "dashboard") {
                  setRemovingItem(true);
                  await removeItemFromDatabase();
                  setRemovingItem(false);
                  onClose();
                  onSaved?.();
                } else {
                  removeScannedItem(selectedScannedItem);
                }
              }}
            >
              <SvgXml
                xml={thrash}
                width={24}
                height={24}
                color={colors.white}
              />
              <Text style={styles.sellOptionText}>Remove item</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isSellOptionsModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSellOptionsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsSellOptionsModalVisible(false)}
        >
          <View style={styles.sellOptionsContainer}>
            <Text style={styles.sellOptionsTitle}>Choose platform</Text>
            <TouchableOpacity
              style={styles.sellOptionButton}
              onPress={() => {
                setIsSellOptionsModalVisible(false);
                setIsFacebookModalVisible(true);
              }}
            >
              <SvgXml
                xml={facebook}
                width={24}
                height={24}
                color={colors.white}
              />
              <Text style={styles.sellOptionText}>Sell on Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sellOptionButton}
              onPress={() => {
                setIsSellOptionsModalVisible(false);
                // TODO: Implement eBay functionality
              }}
            >
              <View className="bg-white rounded-lg p-2">
                <SvgXml
                  xml={ebay}
                  width={24}
                  height={24}
                  color={colors.white}
                />
              </View>
              <Text style={styles.sellOptionText}>Sell on eBay</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {isSavingModalVisible && (
        <Loader text="Saving..." textOptional="Hang on a second" />
      )}
      {removingItem && <Loader text="Removing item..." />}
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
    backgroundColor: colors.neutral[50],
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
    color: colors.neutral[900],
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: colors.neutral[900],
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
    backgroundColor: "rgb(255, 255, 255)",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.neutral[500],
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
    color: colors.neutral[900],
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
    color: colors.neutral[500],
    marginBottom: 4,
  },
  priceRangeText: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.neutral[900],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
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
    color: colors.neutral[900],
  },
  priceInput: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.neutral[900],
    flex: 1,
    padding: 0,
  },
  confidencePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.neutral[900],
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.green[500],
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: "#D1D5DB",
  },
  descriptionInput: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.neutral[500],
    minHeight: 60,
    padding: 0,
  },
  primaryButton: {
    marginTop: 12,
    backgroundColor: colors.neutral[900],
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
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
    backgroundColor: colors.neutral[100],
    alignItems: "center",
    justifyContent: "center",
  },
  addPhotoText: {
    fontSize: 32,
    color: colors.neutral[900],
    fontWeight: "300",
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#111827",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#111827",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdownButtonText: {
    fontSize: 13,
    color: "#D1D5DB",
  },
  dropdownButtonPlaceholder: {
    color: "#6B7280",
  },
  dropdownArrow: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  dropdownBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "#111827",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: 200,
    maxHeight: 300,
    overflow: "hidden",
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  dropdownOptionSelected: {
    backgroundColor: "#1F2937",
  },
  dropdownOptionText: {
    fontSize: 14,
    color: "#D1D5DB",
  },
  dropdownOptionTextSelected: {
    color: "#A3E635",
    fontWeight: "600",
  },
  shoeSizeRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  shoeSizeInput: {
    flex: 1,
    fontSize: 13,
    color: "#D1D5DB",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#111827",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
  },
  shoeSizeUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#111827",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#374151",
    minWidth: 70,
  },
  shoeSizeUnitText: {
    fontSize: 13,
    color: "#D1D5DB",
    marginRight: 6,
  },
  actionsContainer: {
    gap: 12,
    marginTop: 12,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.neutral[200],
    flexDirection: "row",
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.neutral[900],
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  sellOptionsContainer: {
    backgroundColor: colors.neutral[50],
    borderRadius: 18,
    padding: 20,
    minWidth: 280,
    borderWidth: 2,
    borderColor: colors.neutral[400],
  },
  sellOptionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.neutral[900],
    marginBottom: 16,
    textAlign: "center",
  },
  sellOptionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.neutral[900],
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sellOptionText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
    textAlign: "center",
  },
});

export default ListingDetails;
