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

  const { onboardingFinished } = useAppStore();
  useEffect(() => {
    /*supabase.auth
      .signOut()
      .then(() => {
        console.log("Signed out");
      })
      .catch((error) => {
        console.log("Error signing out", error);
      });*/

    checkHasLaunched();
  }, [onboardingFinished]);

  const checkHasLaunched = async () => {
    //const hasLaunched = await AsyncStorage.removeItem("hasLaunched");
    const hasLaunched = await AsyncStorage.getItem("hasLaunched");
    setHasLaunched(hasLaunched as unknown as boolean);
    setInitalCheck(true);
  };

  useEffect(() => {
    if (initalCheck) {
      if (!hasLaunched) {
        setStartOnboarding(true);
      } else if (hasLaunched && !user) {
        setStartAuth(true);
      } else if (hasLaunched && user) {
        setStartApp(true);
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
