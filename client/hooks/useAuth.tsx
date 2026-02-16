import Purchases from "react-native-purchases";
import { supabase } from "../services/supabase/supabaseClient";
import { useUserStore } from "../stores/userStore";
import { useEffect } from "react";
import { useOnboardingStore } from "../stores/onboardingStore";

interface UseAuthProps {
  revenueCatConfigured: boolean;
}

const useAuth = ({ revenueCatConfigured }: UseAuthProps) => {
  const setUser = useUserStore((state) => state.setUser);
  const { setIsSubscribed, setAuthFinished } = useUserStore();
  const setOnboardingStep = useOnboardingStore(
    (state) => state.setOnboardingStep,
  );
  useEffect(() => {
    if (!revenueCatConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const isOnboarding = useOnboardingStore.getState().isOnboarding;
        if (isOnboarding) {
          setOnboardingStep(9);
        } else {
          handleSubscriptionCheck(session?.user.id);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [revenueCatConfigured]);

  const handleSubscriptionCheck = async (userId: string) => {
    const { customerInfo } = await Purchases.logIn(userId);

    console.log("customerInfo", customerInfo);

    if (userId === "730c9fa4-0ea7-4400-8eb4-8887dbe989b1") {
      setIsSubscribed(true);
      setAuthFinished(true);
      return;
    }

    if (Object.keys(customerInfo.entitlements.active).length > 0) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }

    setAuthFinished(true);
  };

  return null;
};

export default useAuth;
