import Toast from "react-native-toast-message";
import { View, Text } from "react-native";

const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="bg-dark2 border-l-4 border-accent1 rounded-2xl px-4 py-3 mx-4">
      <Text className="text-light2 text-lg font-sans">{text1}</Text>
      {text2 ? <Text className="text-light3 text-sm ">{text2}</Text> : null}
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View className="bg-dark2 border-l-4 border-red-500 rounded-2xl px-4 py-3 mx-4">
      <Text className="text-light2 text-base font-sans">{text1}</Text>
      {text2 ? <Text className="text-light3 text-sm mt-1">{text2}</Text> : null}
    </View>
  ),
};

export default toastConfig;
