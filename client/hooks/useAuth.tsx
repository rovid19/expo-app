import Purchases from "react-native-purchases";
import { supabase } from "../services/supabase/supabaseClient";
import { useUserStore } from "../stores/userStore";
import { useEffect } from "react";

interface UseAuthProps {
  revenueCatConfigured: boolean;
}

const useAuth = ({ revenueCatConfigured }: UseAuthProps) => {
  const setUser = useUserStore((state) => state.setUser);
  const { setIsSubscribed, setAuthFinished } = useUserStore();

  useEffect(() => {
    if (!revenueCatConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      console.log("❤️ Auth state changed:", session?.user?.id);

      if (session?.user) {
        handleSubscriptionCheck(session?.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [revenueCatConfigured]);

  const handleSubscriptionCheck = async (userId: string) => {
    const { customerInfo, created } = await Purchases.logIn(userId);
    console.log("❤️ Created:", created);
    console.log("❤️ Customer info:", customerInfo);

    // If user already existed and has no entitlements, restore from store
    if (
      !created &&
      Object.keys(customerInfo.entitlements.active).length === 0
    ) {
      console.log(
        "⚠️ Customer exists but has no entitlements - restoring from store...",
      );
      try {
        const restoredInfo = await Purchases.restorePurchases();
        console.log("✅ Restored info:", restoredInfo.entitlements.active);

        if (Object.keys(restoredInfo.entitlements.active).length > 0) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error("❌ Restore failed:", error);
        setIsSubscribed(false);
      }
    } else {
      // Normal check
      setIsSubscribed(Object.keys(customerInfo.entitlements.active).length > 0);
    }

    setAuthFinished(true);
  };

  return null;
};

export default useAuth;

/*






  const handleSubscriptionCheck = async (userId: string) => {
    const { customerInfo, created } = await Purchases.logIn(userId);
    console.log("❤️ Created:", created);
    console.log("❤️ Customer info:", customerInfo);

    console.log(
      "❤️ Customer info entitlements:",
      customerInfo.entitlements.active,
    );

    if (Object.keys(customerInfo.entitlements.active).length > 0) {
      setIsSubscribed(true);
    } else {
      setIsSubscribed(false);
    }

    setAuthFinished(true);
  };




*/
