import { Text, View } from "react-native";
import * as Linking from "expo-linking";

const authFooter = () => {
  return (
    <View className="flex flex-row gap-2 items-center justify-center">
      <Text className="text-sm font-sans text-light3 text-center">
        By pressing on “Continue with...” you agree to our{" "}
        <Text
          className="font-bold text-light3"
          onPress={() => {
            Linking.openURL("https://www.dexlyapp.co/terms-of-service");
          }}
          style={{ textDecorationLine: "underline" }}
        >
          Terms of Service
        </Text>{" "}
        and{" "}
        <Text
          className="font-bold text-light3"
          onPress={() => {
            Linking.openURL("https://www.dexlyapp.co/privacy-policy");
          }}
          style={{ textDecorationLine: "underline" }}
        >
          Privacy Policy
        </Text>
      </Text>
    </View>
  );
};

export default authFooter;
