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
    console.log("performing account setup");
    const userExtraExists = await AppService.checkIfUserExtraExists(user?.id);
    if (!userExtraExists) {
      setIsModal({
        visible: true,
        content: <InitialUserSetup />,
        popupContent: null,
      });
    } else {
      console.log("getting user extra");
      const data = await AppService.getUserExtra(user?.id);
      if (data) {
        console.log("data", data);
        currencySetup(data.currency);
        setName(data.name);
      }
    }
  };
  return { performAccountSetup };
};

export default useOnceAfterAuth;
