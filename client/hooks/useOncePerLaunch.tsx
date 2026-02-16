import { useEffect } from "react";
import { AppService } from "../services/appService";
import { useUserStore } from "../stores/userStore";
import { useAppStore } from "../stores/appStore";
import IsntSubscribed from "../components/appModals/isntSubscribed";
import InitialUserSetup from "../components/appModals/initialUserSetup";

const useOnceAfterAuth = () => {
  const { user } = useUserStore();
  const {
    setCurrency,
    setName,
    setCurrencySymbol,
    setIsModal,
    triggerRefresh,
  } = useAppStore();
  const { authFinished, isSubscribed } = useUserStore();

  useEffect(() => {
    if (authFinished) {
      console.log("authFinished");
      console.log(isSubscribed);
      if (isSubscribed) {
        performAccountSetup();
      } else {
        setIsModal({
          visible: true,
          content: <IsntSubscribed />,
          popupContent: null,
        });
      }
    }
  }, [authFinished, triggerRefresh]);

  // ACCOUNT SETUP
  const currencySetup = (currency: string) => {
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
    console.log("performAccountSetup");
    const userExtraExists = await AppService.checkIfUserExtraExists(user?.id);
    if (!userExtraExists) {
      console.log("userExtraExists");
      setIsModal({
        visible: true,
        content: <InitialUserSetup />,
        popupContent: null,
      });
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
