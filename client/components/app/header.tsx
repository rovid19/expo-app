import { View, Text } from "react-native";
interface HeaderProps {
  title: string;
}

const header = ({ title }: HeaderProps) => {
  return (
    <View className="flex flex-row items-end justify-between w-full py-2">
      <Text className="text-light3 font-bold text-md">{title}</Text>
    </View>
  );
};

export default header;
