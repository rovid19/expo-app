import React, { useEffect } from "react";
import { useState } from "react";
import { useUserStore } from "../stores/userStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../stores/appStore";
import Purchases from "react-native-purchases";
import { supabase } from "../services/supabase/supabaseClient";
import { useOnboardingStore } from "../stores/onboardingStore";

const useOnAppStart = () => {
  const user = useUserStore((state) => state.user);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [startAuth, setStartAuth] = useState(false);
  const [startApp, setStartApp] = useState(false);
  const [startOnboarding, setStartOnboarding] = useState(false);
  const [initalCheck, setInitalCheck] = useState(false);
  const { isOnboarding } = useOnboardingStore();

  useEffect(() => {
    checkHasLaunched();
  }, [isOnboarding]);

  const checkHasLaunched = async () => {
    const hasLaunched = await AsyncStorage.getItem("hasLaunched");
    setHasLaunched(hasLaunched as unknown as boolean);
    setInitalCheck(true);
  };

  useEffect(() => {
    if (initalCheck) {
      if (!hasLaunched) {
        setStartOnboarding(true);
        setStartAuth(false);
        setStartApp(false);
      } else if (hasLaunched && !user) {
        setStartAuth(true);
        setStartOnboarding(false);
        setStartApp(false);
      } else if (hasLaunched && user) {
        setStartApp(true);
        setStartOnboarding(false);
        setStartAuth(false);
      }
    }
  }, [hasLaunched, user, initalCheck]);

  return {
    startOnboarding,
    startApp,
    startAuth,
  };
};

export default useOnAppStart;
