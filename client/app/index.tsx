import Auth from "../components/auth/auth";
import { useRouter } from "expo-router";
import Onboarding from "../components/onboarding/index";
import useOnAppStart from "../hooks/useOnAppStart";
import { useAppStore } from "../stores/appStore";
import LaunchOpeningAnimation from "../components/app/launchOpeningAnimation";
import { useEffect } from "react";

export default function Index() {
  const { startOnboarding, startAuth, startApp } = useOnAppStart();
  const { launchOpeningAnimation } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!launchOpeningAnimation && startApp) {
      router.replace("/(tabs)/home");
    }
  }, [launchOpeningAnimation, startApp]);

  if (launchOpeningAnimation) {
    return <LaunchOpeningAnimation />;
  }

  if (startAuth) {
    return <Auth />;
  }

  if (startOnboarding) {
    return <Onboarding />;
  }

  return null;
}
