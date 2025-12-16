import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase/supabaseClient";
import { useUserStore } from "../stores/userStore";
import "../global.css";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
