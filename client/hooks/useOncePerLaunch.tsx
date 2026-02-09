import React, { useEffect } from "react";
import { AppService } from "../services/appService";
import { useUserStore } from "../stores/userStore";
import { useAppStore } from "../stores/appStore";
import IsntSubscribed from "../components/appModals/isntSubscribed";

const useOnceAfterAuth = () => {
  const { user } = useUserStore();
  const { setCurrency, setName, setCurrencySymbol, setIsModal } = useAppStore();
  const { authFinished, isSubscribed } = useUserStore();

  useEffect(() => {
    if (authFinished) {
      startApp();
    }
  }, [authFinished]);

  const startApp = () => {
    if (isSubscribed) {
      performAccountSetup();
    } else {
      console.log("❤️ is this user fucking subscribed????", isSubscribed);

      setIsModal({
        visible: true,
        content: <IsntSubscribed />,
        popupContent: null,
      });
    }
  };

  // ACCOUNT SETUP
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
    } else {
      const data = await AppService.getUserExtra(user?.id);
      if (data) {
        currencySetup(data.currency);
        setName(data.name);
      }
    }
  };
  return { performAccountSetup };
};

export default useOnceAfterAuth;
