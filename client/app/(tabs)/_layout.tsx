import { Tabs } from "expo-router";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import {
  homeFilled,
  homeOutline,
  scanOutline,
  userFilled,
  userOutline,
} from "../../assets/icons/icons";
import TabBar from "../../components/tabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
        tabBarShowLabel: false,
        tabBarBackground: () => <View className="flex-1 bg-white pt-20" />,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <SvgXml
              xml={focused ? homeFilled : homeOutline}
              width={28}
              height={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="scan/index"
        options={{
          title: "Scan",
          tabBarIcon: ({ color }) => (
            <SvgXml xml={scanOutline} width={28} height={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <SvgXml
              xml={focused ? userFilled : userOutline}
              width={28}
              height={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
