import React, { useEffect, useCallback } from "react";
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
const ENTITLEMENT_ID = 'Pro';

interface OnboardingCheckoutProps {
  setOnboardingStep: React.Dispatch<React.SetStateAction<number>>;
  onboardingStep: number;
}

const OnboardingCheckout: React.FC<OnboardingCheckoutProps> = ({
  setOnboardingStep,
  onboardingStep,
}) => {
  const { setOnboardingFinished, setIsModal, selectedPackage } = useAppStore();
  const {open} = usePopupStore();

 // 🔥 RevenueCat listener (fires on ALL purchases)
 useEffect(() => {

  let isActive = true;
  
  const listener = (customerInfo: CustomerInfo) => {
    if (!isActive) return;
    const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (hasPro) {
      //console.log('✅ ENTITLEMENT ACTIVE - redirecting!');
      setIsModal({visible: false, content: null, popupContent: null});
      setOnboardingStep(10);
      AsyncStorage.setItem("hasLaunched", "true");
      setOnboardingFinished(true);
    }
  };

  Purchases.addCustomerInfoUpdateListener(listener);

  // Initial check
  (async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    console.log(
      'Active entitlement IDs:',
      Object.keys(customerInfo.entitlements.active)
    );
    console.log(
      'All entitlements:',
      customerInfo.entitlements.all
    );
    const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
    if (hasPro && isActive) setOnboardingStep(10);
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

  console.log('🚀 Initiating purchase');
  
  try {
    open(<Loader text="Purchasing..." isPurchasing={true} />);
    await Purchases.purchasePackage(selectedPackage);
   
    
    // Backup poll
    setTimeout(async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const hasPro = !!customerInfo.entitlements.active[ENTITLEMENT_ID];
        //console.log('⏱️ Backup poll:', hasPro);
        if (hasPro) {
          //console.log('✅ Backup redirect!');
          setOnboardingStep(10);
        }
      } catch (error) {
        console.error('Backup poll failed:', error);
      }
    }, 2500);
    
  } catch (error) {
    console.error('❌ Purchase start failed:', error);

  }
}
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
          <Text className="text-light2 font-bold text-xl">No Payment Due Now</Text>
        </View>

        <Button
          title={onboardingStep === 8 ? "Try for $0.00" : "Start My 3-Day Free Trial"}
          onPress={() => {
            console.log("onboardingStep", onboardingStep);
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
        />

        <Text className="text-light3 font-bold text-base">
          {onboardingStep === 8
            ? "Just $34,99 per year (2,91 $/mo)"
            : "3 days free, then $34,99 per year (2,91 $/mo)"}
        </Text>
      </View>
    </View>
  );
};

export default OnboardingCheckout;
