import React from "react";
import { AppService } from "../services/appService";
import { useUserStore } from "../stores/userStore";
import { useAppStore } from "../stores/appStore";
import IsntSubscribed from "../components/appModals/isntSubscribed";

const useOncePerLaunch = () => {
  const { user } = useUserStore();
  const { setCurrency, setName, setCurrencySymbol, setIsModal } = useAppStore();
  const isSubscribed = useUserStore((state) => state.isSubscribed);
  const runOncePerLaunch = async () => {
    console.log('is this user fucking subscribed????!!wqoejqwopeopqweioqwiope AAAAH!', isSubscribed);
    if (!isSubscribed) {
      setIsModal({visible: true, content: <IsntSubscribed />, popupContent: null}); 
    } else {
    
      await performAccountSetup();
      const data = await AppService.getUserExtra(user?.id);
      if (data) {
        currencySetup(data.currency);
        setName(data.name);
      }
    }

  };

  const currencySetup = (currency: string) => {
    console.log("currency", currency);
    setCurrency(currency);
    if (currency === "USD") {
      setCurrencySymbol("$");
    } else if (currency === "EUR") {
      setCurrencySymbol("€");
    } else if (currency === "GBP") {
      setCurrencySymbol("£");
    } else if (currency === "JPY") {
      setCurrencySymbol("¥");
    }
  };

  const performAccountSetup = async () => {
    const userExtraExists = await AppService.checkIfUserExtraExists(user?.id);
    if (!userExtraExists) {
      await AppService.createUserExtra(user?.id);
    }
  };
  return { performAccountSetup, runOncePerLaunch };
};

export default useOncePerLaunch;
