import { View, Text, TouchableOpacity } from "react-native";
import { SvgXml } from "react-native-svg";
import { check, checkout } from "../../assets/icons/icons";
import { useEffect, useState } from "react";
import useSubscription from "../../hooks/useSubscription";
import { useAppStore } from "../../stores/appStore";

const onboardingCheckoutOptions = () => {
  const [selectedOption, setSelectedOption] = useState<string>("yearly");
  const { currentOffering } = useSubscription();
  const { setSelectedPackage, selectedPackage } = useAppStore();

  useEffect(() => {
    if (!currentOffering) return;
    selectPackage("yearly");
  }, [currentOffering]);

  useEffect(() => {
    console.log("selectedPackage", selectedPackage);
  }, [selectedPackage]);

  const selectPackage = (type: "monthly" | "yearly") => {
    if (!currentOffering) return null;
    setSelectedOption(type);

    const targetType = type === "monthly" ? "MONTHLY" : "ANNUAL";

    const pkg = currentOffering.availablePackages.find(
      (p) => p.packageType === targetType,
    );

    setSelectedPackage(pkg ?? null);
  };

  const selectedYearly = selectedOption === "yearly";
  const selectedMonthly = selectedOption === "monthly";

  return (
    <View className=" flex flex-col gap-10 h-full w-full px-4 justify-center items-center">
      <View className="flex-row w-full items-center justify-center  ">
        <View className="w-10">
          <SvgXml xml={checkout} width="100%" />
        </View>
        <View className="flex flex-col gap-4 flex-1 px-4">
          <View className="flex flex-col ">
            <Text className="text-light2 font-medium text-xl">Today</Text>
            <Text className="text-light3 font-sans text-lg">
              Unlock all the app’s features like AI item scanning and more
            </Text>
          </View>

          <View className="flex flex-col ">
            <Text className="text-light2 font-medium text-xl">Today</Text>
            <Text className="text-light3 font-sans text-lg">
              Unlock all the app’s features like AI item scanning and more
            </Text>
          </View>

          <View className="flex flex-col ">
            <Text className="text-light2 font-medium text-xl">Today</Text>
            <Text className="text-light3 font-sans text-lg">
              Unlock all the app’s features like AI item scanning and more
            </Text>
          </View>
        </View>
        <View></View>
      </View>

      <View className="flex flex-row gap-4 w-full ">
        <TouchableOpacity
          onPress={() => selectPackage("monthly")}
          className={`flex flex-1 flex-row gap-4 p-8 rounded-3xl items-center justify-center ${selectedMonthly ? "bg-dark3" : "bg-dark2"}`}
        >
          <View className="flex flex-col gap-1">
            <Text className="text-light2 font-medium text-2xl">Monthly</Text>
            <Text className="text-light3 font-sans text-lg">9.99 $/month</Text>
          </View>

          <View
            className={`p-2 h-8 w-8 items-center justify-center rounded-full ${selectedMonthly ? "bg-accent2 " : "border border-dark3"}`}
          >
            {selectedMonthly && (
              <SvgXml xml={check} width={16} height={16} color="#E6E6E6" />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => selectPackage("yearly")}
          className={`flex flex-1 flex-row gap-4 p-8 rounded-3xl items-center justify-center ${selectedYearly ? "bg-dark3" : "bg-dark2"}`}
        >
          <View className="flex flex-col gap-1">
            <Text className="text-light2 font-medium text-2xl">Yearly</Text>
            <Text className="text-light3 font-sans text-lg">2,91 $/mo</Text>
          </View>

          <View
            className={`p-2 h-8 w-8 items-center justify-center rounded-full ${selectedYearly ? "bg-accent2 " : "border border-dark3"}`}
          >
            {selectedYearly && (
              <SvgXml xml={check} width={16} height={16} color="#E6E6E6" />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default onboardingCheckoutOptions;
