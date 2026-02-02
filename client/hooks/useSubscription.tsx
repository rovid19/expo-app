import { useEffect, useState } from 'react';
import Purchases, { PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';

interface UseSubscriptionReturn {
  offerings: PurchasesOfferings | null;
  currentOffering: PurchasesOfferings['current'] | null;
  availablePackages: PurchasesPackage[];
  isLoading: boolean;
  error: Error | null;
  refetchOfferings: () => Promise<void>;
}

const useSubscription = (): UseSubscriptionReturn => {
  const [offerings, setOfferings] = useState<PurchasesOfferings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOfferings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedOfferings = await Purchases.getOfferings();
      setOfferings(fetchedOfferings);
      
      if (fetchedOfferings.current === null || fetchedOfferings.current.availablePackages.length === 0) {
        console.warn('No current offering or packages available');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err : new Error('Failed to fetch offerings');
      setError(errorMessage);
      console.error('Error fetching offerings:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch offerings (RevenueCat is already configured in _layout.tsx)
    fetchOfferings();
  }, []);

  

  return {
    offerings,
    currentOffering: offerings?.current || null,
    availablePackages: offerings?.current?.availablePackages || [],
    isLoading,
    error,
    refetchOfferings: fetchOfferings,
  };
};

export default useSubscription;
