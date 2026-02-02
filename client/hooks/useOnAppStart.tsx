import React, { useEffect } from "react";
import { useState } from "react";
import { useUserStore } from "../stores/userStore";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppStore } from "../stores/appStore";

const useOnAppStart = () => {
  const user = useUserStore((state) => state.user);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [startAuth, setStartAuth] = useState(false);
  const [startApp, setStartApp] = useState(false);
  const [startOnboarding, setStartOnboarding] = useState(false);

  const {onboardingFinished} = useAppStore();

  useEffect(() => {
    checkHasLaunched();
  }, [onboardingFinished]);

  const checkHasLaunched = async () => {
    const hasLaunched = await AsyncStorage.getItem("hasLaunched");
    setHasLaunched(hasLaunched as unknown as boolean);
  };

  useEffect(() => {
    if (!hasLaunched) {
      setStartOnboarding(true);
    } else if (hasLaunched && !user) {
      setStartAuth(true);
    } else if (hasLaunched && user) {
      setStartApp(true);
    }
  }, [hasLaunched, user]);

  return {
    startOnboarding,
    startApp,
    startAuth,
  };
};

export default useOnAppStart;
