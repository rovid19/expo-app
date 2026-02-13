import { useUserStore } from "../../stores/userStore";
import { View, Image, Text } from "react-native";
import { SvgXml } from "react-native-svg";
import { logo } from "../../assets/icons/icons";

const profileCard = () => {
  const user = useUserStore((state) => state.user);

  const name = user?.user_metadata.name ? user.user_metadata.name : "John Doe";
  const email = user?.email ? user.email : "john.doe@example.com";
  const avatar = user?.user_metadata.avatar_url
    ? user.user_metadata.avatar_url
    : "";
  return (
    <View className="w-full flex flex-row mb-4 rounded-2xl p-2 bg-dark2">
      <View className="w-[40%] flex items-center justify-center p-2">
        {avatar ? (
          <Image
            source={{ uri: avatar }}
            width={84}
            height={84}
            className="rounded-full"
          />
        ) : (
          <SvgXml xml={logo} width={84} height={84} />
        )}
      </View>
      <View className="flex-1 flex flex-col p-2 justify-center">
        <Text className="text-2xl font-bold text-light2">{name}</Text>
        <Text className="text-sm text-light3">{email}</Text>
      </View>
    </View>
  );
};

export default profileCard;
