import { BlurView } from "expo-blur";
import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Button from "../app/button";
import { AppService } from "../../services/appService";
import { useUserStore } from "../../stores/userStore";
import { useAppStore } from "../../stores/appStore";

const currencies = ["USD", "EUR"];

const initialUserSetup = () => {
  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const { user } = useUserStore();
  const { setTriggerRefresh, setIsModal } = useAppStore();

  const handleSubmit = async () => {
    if (name && currency) {
      await AppService.createUserExtra(user?.id as string, name, currency);
      setTriggerRefresh(true);
      setIsModal({ visible: false, content: null, popupContent: null });
    } else {
      Alert.alert("Please fill in all fields");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-dark1/50 relative">
      <BlurView intensity={20} tint="dark" className="absolute inset-0" />

      <View className="w-full flex flex-col justify-center items-center gap-2 bg-dark1 p-8 rounded-3xl">
        <Text className="text-light1 text-2xl font-bold">
          Initial User Setup
        </Text>

        <TextInput
          className="w-full bg-dark2 rounded-3xl p-4 mt-6 text-light2 text-lg"
          placeholder="Please enter your name"
          placeholderTextColor="#999999"
          value={name}
          onChangeText={setName}
        />

        <View className="w-full mb-6 rounded-3xl bg-dark2 overflow-hidden">
          <SelectDropdown
            data={currencies}
            defaultValueByIndex={-1}
            onSelect={(selectedItem) => setCurrency(selectedItem)}
            renderButton={(selectedItem) => (
              <View style={styles.dropdownButton}>
                <Text style={styles.dropdownButtonText}>
                  {selectedItem ?? "Select currency"}
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

        <Button
          title="Submit"
          onPress={handleSubmit}
          backgroundColor="bg-accent1"
          textColor="text-dark1"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    width: "100%",
    backgroundColor: "transparent",
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

export default initialUserSetup;
