import React, { useEffect, useCallback, useState } from "react";
import { View, Text, Alert } from "react-native";
import { SvgXml } from "react-native-svg";
import { check } from "../../assets/icons/icons";
import Button from "../app/button";
import OnboardingCheckoutOptions from "./onboardingCheckoutOptions";
import { useAppStore } from "../../stores/appStore";
import Purchases, { CustomerInfo } from "react-native-purchases";
import { usePopupStore } from "../../stores/popupStore";
import Loader from "../app/loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useOnboardingStore } from "../../stores/onboardingStore";
import { useUserStore } from "../../stores/userStore";
import { AppService } from "../../services/appService";
const ENTITLEMENT_ID = "Pro";

interface OnboardingCheckoutProps {
  onboardingAnswers: string[];
}

const OnboardingCheckout = ({ onboardingAnswers }: OnboardingCheckoutProps) => {
  const { setOnboardingStep, onboardingStep } = useOnboardingStore();
  const { setIsModal, selectedPackage } = useAppStore();
  const { open } = usePopupStore();
  const { user, setIsSubscribed } = useUserStore();
  const { setIsOnboarding } = useOnboardingStore();
  const [buttonAnimation, setButtonAnimation] = useState(false);

  const handleSubscriptionCheck = async (userId: string) => {
    const { customerInfo, created } = await Purchases.logIn(userId);
    console.log("❤️ Created:", created);
    console.log("❤️ Customer info:", customerInfo);

    // If user already existed and has no entitlements, restore from store
    if (
      !created &&
      Object.keys(customerInfo.entitlements.active).length === 0
    ) {
      console.log(
        "⚠️ Customer exists but has no entitlements - restoring from store...",
      );
      try {
        const restoredInfo = await Purchases.restorePurchases();
        console.log("✅ Restored info:", restoredInfo.entitlements.active);

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

  useEffect(() => {
    console.log("onboardingStep", onboardingStep);
    console.log("selectedPackage", selectedPackage?.packageType);
  }, [selectedPackage]);

  // 🔥 RevenueCat listener (fires on ALL purchases)
  useEffect(() => {
    let isActive = true;

    const listener = (customerInfo: CustomerInfo) => {
      if (!isActive) return;
      const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
      if (hasPro) {
        setButtonAnimation(false);
        handleSubscriptionCheck(user?.id);
        AsyncStorage.setItem("hasLaunched", "true");
        setIsOnboarding(false);
        AppService.createOnboardingData(user?.id, onboardingAnswers);
      }
    };

    Purchases.addCustomerInfoUpdateListener(listener);

    // Initial check
    (async () => {
      const customerInfo = await Purchases.getCustomerInfo();
      console.log("App User ID:", await Purchases.getAppUserID());

      console.log("customerInfo", customerInfo);

      console.log("All entitlements:", customerInfo.entitlements.all);
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
    console.log("🚀 Initiating purchase");

    try {
      await Purchases.purchasePackage(selectedPackage);

      //open(<Loader text="Purchasing" isPurchasing={true} dots={false} />);

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
  return (
    <View className="flex-1 items-center flex flex-col gap-8 pt-28">
      <View className="flex flex-col gap-2 items-center justify-center">
        <Text className="text-light2 font-bold text-4xl">
          {onboardingStep === 8 ? "We want you to" : "Start your 3-day FREE"}
        </Text>
        <Text className="text-light2 font-bold text-4xl">
          {onboardingStep === 8 ? "try Dexly for free" : "trial to continue."}
        </Text>
      </View>

      <View className="flex-1 w-full">
        {onboardingStep === 8 && <Text>Video</Text>}
        {onboardingStep === 9 && <OnboardingCheckoutOptions />}
      </View>

      <View className="w-full flex flex-col gap-2 items-center justify-center pb-12">
        <View className="w-full flex flex-row gap-2 items-center justify-center">
          <SvgXml xml={check} width={24} height={24} color="#00FF00" />
          <Text className="text-light2 font-bold text-xl">
            No Payment Due Now
          </Text>
        </View>

        <Button
          title={
            onboardingStep === 8 ? "Try for $0.00" : "Start My 3-Day Free Trial"
          }
          onPress={() => {
            if (onboardingStep === 8) {
              setOnboardingStep(onboardingStep + 1);
            } else {
              initiatePurchase();
            }
          }}
          iconSize={24}
          disabled={onboardingStep === 9 && !selectedPackage}
          backgroundColor="bg-accent1"
          textColor="text-dark1"
          padding={6}
          animation={buttonAnimation}
          animationText="Purchasing..."
        />

        <Text className="text-light3 font-bold text-base">
          {onboardingStep === 9 && selectedPackage?.packageType === "ANNUAL"
            ? "3 days free, then $34,99 per year (2,91 $/mo)"
            : "3 days free, then $9,99 per month"}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingCheckout;
