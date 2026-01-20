import { useEffect } from "react";
import { useUserStore } from "../stores/userStore";
import Auth from "../components/auth/auth";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";
export default function Index() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home");
    }
  }, [user]);

  if (!user) {
    return <Auth />;
  }

  return null;

  /*useEffect(() => {
    router.replace("/(tabs)/home");
  }, []);*/
}
