import { View, Text } from "react-native";
import { logo } from "../../assets/icons/icons";
import Header from "../header";

const header = () => {
  return (
    <>
      <Header title="HOME" svg={logo} />

      <View className="flex flex-col ">
        <Text className="text-5xl font-bold font-bold text-light2">Hello,</Text>
        <View className="flex flex-row items-center gap-2">
          <Text className="text-5xl font-bold font-bold text-light2">
            Roberto
          </Text>
          <Text className="text-4xl">👋</Text>
        </View>
      </View>
    </>
  );
};

export default header;
