import React, { useEffect } from "react";
import { useState } from "react";
import { useUserStore } from "../stores/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../stores/appStore";
import Purchases from "react-native-purchases";
import { supabase } from "../services/supabase/supabaseClient";

const useOnAppStart = () => {
  const user = useUserStore((state) => state.user);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [startAuth, setStartAuth] = useState(false);
  const [startApp, setStartApp] = useState(false);
  const [startOnboarding, setStartOnboarding] = useState(false);
  const [initalCheck, setInitalCheck] = useState(false);

  const {onboardingFinished, setIsModal} = useAppStore();
  const setIsSubscribed = useUserStore((state) => state.setIsSubscribed);
  useEffect(() => {
    
 
    checkHasLaunched();
  }, [onboardingFinished]);

  const checkHasLaunched = async () => {
    
    const hasLaunched = await AsyncStorage.getItem("hasLaunched")
    setHasLaunched(hasLaunched as unknown as boolean);
    setInitalCheck(true);
  };

  const checkIfSubscribed = async () => {
    console.log("Checking if subscribed");
    const customerInfo = await Purchases.getCustomerInfo();
    console.log('customerInfo', customerInfo);
    console.log('customerInfo.activeSubscriptions', customerInfo.activeSubscriptions.length);
    return customerInfo.activeSubscriptions.length > 0;
  };  

  const launchApp = async () => {
    const isSubscribed = await checkIfSubscribed();
    console.log('is this user fucking subscribed????!!!', isSubscribed);
    setIsSubscribed(isSubscribed);
    setStartApp(true);
  };

  useEffect(() => {
    if (initalCheck) {
    if (!hasLaunched) {
      setStartOnboarding(true);
    } else if (hasLaunched && !user) {
      setStartAuth(true);
    } else if (hasLaunched && user) {
      launchApp();
    }
    }
  }, [hasLaunched, user]);

  return {
    startOnboarding,
    startApp,
    startAuth,
  };
};

export default useOnAppStart;
