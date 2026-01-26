import Toast from "react-native-toast-message";
import { View, Text } from "react-native";

const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="bg-dark2 border border-dark3 rounded-3xl px-4 py-3 mx-4">
      <View className="flex flex-row items-center gap-2">
        <Text className="text-light2 text-lg font-sans">👍 </Text>
        <Text className="text-light2 text-lg font-sans">{text1}</Text>
        {text2 ? <Text className="text-light3 text-sm">{text2}</Text> : null}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View className="bg-dark2 border border-danger rounded-3xl px-4 py-3 mx-4">
      <Text className="text-light2 text-base font-sans">{text1}</Text>
      {text2 ? <Text className="text-light3 text-sm mt-1">{text2}</Text> : null}
    </View>
  ),
};

export default toastConfig;
