import { BlurView } from "expo-blur";
import { View, Text, Pressable } from "react-native";
import { useAppStore } from "../../stores/appStore";
import { AppService } from "../../services/appService";
import { useUserStore } from "../../stores/userStore";
import SelectDropdown from "react-native-select-dropdown";
import { StyleSheet } from "react-native";
import ContentContainer from "../app/contentContainer";

const currencies = ["USD", "EUR"];

const AppSettingsModal = () => {
  const { setIsModal, currency, setTriggerRefresh, triggerRefresh } =
    useAppStore();
  const { user } = useUserStore();

  const handleCurrencyChange = async (currency: string) => {
    await AppService.updateUserExtra(user?.id as string, { currency });
    setTriggerRefresh(!triggerRefresh);
  };

  return (
    <View className="flex-1 justify-center items-center bg-dark1/50 rounded-3xl w-full relative px-4">
      <BlurView intensity={20} tint="dark" className="absolute inset-0" />
      <ContentContainer className="flex-1 flex justify-center items-center">
        <Pressable
          onPress={() =>
            setIsModal({ visible: false, content: null, popupContent: null })
          }
          className="absolute inset-0"
        />

        <View className="bg-dark1 rounded-3xl w-full p-8">
          <Text className="text-light2 text-2xl font-bold mb-2">
            App Currency:
          </Text>

          <View className="w-full mt-4 rounded-3xl bg-dark2 overflow-hidden">
            <SelectDropdown
              data={currencies}
              defaultValueByIndex={-1}
              onSelect={(selectedItem) => handleCurrencyChange(selectedItem)}
              renderButton={(selectedItem) => (
                <View style={styles.dropdownButton}>
                  <Text style={styles.dropdownButtonText}>
                    {selectedItem ?? currency}
                  </Text>
                </View>
              )}
              renderItem={(item) => (
                <View style={styles.dropdownRow}>
                  <Text style={styles.dropdownRowText}>{item}</Text>
                </View>
              )}
              dropdownStyle={styles.dropdownMenu}
            />
          </View>
        </View>
      </ContentContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    width: "100%",
    backgroundColor: "#1A1A1A",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dropdownButtonText: {
    color: "#999999",
    textAlign: "left",
    fontSize: 16,
  },
  dropdownRow: {
    backgroundColor: "#1f1f1f",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownRowText: {
    color: "#e5e5e5",
    fontSize: 16,
  },
  dropdownMenu: {
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
  },
});

export default AppSettingsModal;
