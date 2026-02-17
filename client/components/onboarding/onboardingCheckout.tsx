import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { SvgXml } from "react-native-svg";
import { check } from "../../assets/icons/icons";
import Button from "../app/button";
import OnboardingCheckoutOptions from "./onboardingCheckoutOptions";
import { useAppStore } from "../../stores/appStore";
import Purchases, { CustomerInfo } from "react-native-purchases";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { useUserStore } from "../../stores/userStore";
import { AppService } from "../../services/appService";
import * as Notifications from "expo-notifications";

const ENTITLEMENT_ID = "Pro";

interface OnboardingCheckoutProps {
  onboardingAnswers: string[];
}

const OnboardingCheckout = ({ onboardingAnswers }: OnboardingCheckoutProps) => {
  const { setOnboardingStep, onboardingStep } = useOnboardingStore();
  const { selectedPackage } = useAppStore();
  const { user, setIsSubscribed, setAuthFinished } = useUserStore();
  const { setIsOnboarding } = useOnboardingStore();
  const [buttonAnimation, setButtonAnimation] = useState(false);

  const handleSubscriptionCheck = async (userId: string) => {
    const { customerInfo, created } = await Purchases.logIn(userId);

    console.log("customerInfo", customerInfo);
    console.log("created", created);

    // If user already existed and has no entitlements, restore from store
    if (
      !created &&
      Object.keys(customerInfo.entitlements.active).length === 0
    ) {
      try {
        const restoredInfo = await Purchases.restorePurchases();

        if (Object.keys(restoredInfo.entitlements.active).length > 0) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("❌ Restore failed:", error);
        setIsSubscribed(false);
      }
    } else {
      // Normal check
      setIsSubscribed(Object.keys(customerInfo.entitlements.active).length > 0);
    }
  };

  // 🔥 RevenueCat listener (fires on ALL purchases)
  useEffect(() => {
    let isActive = true;

    const listener = async (customerInfo: CustomerInfo) => {
      if (!isActive) return;
      console.log("customerInfo listener", customerInfo);
      const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
      const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
      console.log("hasPro", hasPro);
      if (hasPro) {
        setButtonAnimation(false);
        await handleSubscriptionCheck(user?.id);
        await AsyncStorage.setItem("hasLaunched", "true");

        // Set these to trigger the useOncePerLaunch effect
        setAuthFinished(true);
        setIsSubscribed(true);

        console.log("entitlement", entitlement);
        console.log("entitlement.expirationDate", entitlement?.expirationDate);

        scheduleTrialEndingReminder(entitlement?.expirationDate ?? "");

        // Save onboarding answers separately
        await AppService.createOnboardingData(user?.id, onboardingAnswers);

        // Wait a bit to ensure performAccountSetup has time to check and show modal
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsOnboarding(false);
      }
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    // Initial check
    (async () => {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
      if (hasPro && isActive) setIsOnboarding(false);
    })();

    return () => {
      isActive = false;
    };
  }, [setOnboardingStep]);

  const initiatePurchase = async () => {
    if (!selectedPackage) {
      Alert.alert("Error", "No package selected");
      return;
    }
    setButtonAnimation(true);

    try {
      await Purchases.purchasePackage(selectedPackage);

      // Backup poll
      setTimeout(async () => {
        try {
          const customerInfo = await Purchases.getCustomerInfo();
          const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
          if (hasPro) {
            setOnboardingStep(10);
          }
        } catch (error) {
          console.error("Backup poll failed:", error);
        }
      }, 2500);
    } catch (error) {
      console.error("❌ Purchase start failed:", error);
    }
  };

  const scheduleTrialEndingReminder = async (expirationDate: string) => {
    const expiration = new Date(expirationDate).getTime();
    const now = Date.now();

    // 12 hours before expiration = 2.5 days after a 3-day trial starts
    const triggerSeconds = Math.floor(
      (expiration - now - 12 * 60 * 60 * 1000) / 1000,
    );

    if (triggerSeconds <= 0) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Trial ending soon",
        body: "Your free trial expires in 12 hours.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: triggerSeconds,
        repeats: false,
      },
    });
  };

  return (
    <View className="flex-1 items-center flex flex-col gap-8 pt-28">
      <View className="flex flex-col gap-2 items-center justify-center">
        <Text className="text-light2 font-bold text-4xl">
          Start your 3-day FREE
        </Text>
        <Text className="text-light2 font-bold text-4xl">
          trial to continue.
        </Text>
      </View>

      <View className="flex-1 w-full">
        <OnboardingCheckoutOptions />
      </View>

      <View className="w-full flex flex-col gap-2 items-center justify-center pb-12">
        <View className="w-full flex flex-row gap-2 items-center justify-center">
          <SvgXml xml={check} width={24} height={24} color="#00FF00" />
          <Text className="text-light2 font-bold text-xl">
            No Payment Due Now
          </Text>
        </View>

        <Button
          title={"Start My 3-Day Free Trial"}
          onPress={() => {
            initiatePurchase();
          }}
          iconSize={24}
          disabled={!selectedPackage}
          backgroundColor="bg-accent1"
          textColor="text-dark1"
          padding={6}
          animation={buttonAnimation}
          animationText="Purchasing..."
        />

        <Text className="text-light3 font-bold text-base">
          {selectedPackage?.packageType === "ANNUAL"
            ? "3 days free, then $34,99 per year (2,91 $/mo)"
            : "3 days free, then $9,99 per month"}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingCheckout;
