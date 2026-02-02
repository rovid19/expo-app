import Auth from "../components/auth/auth";
import { useRouter } from "expo-router";
import Onboarding from "../components/onboarding/index";
import useOnAppStart from "../hooks/useOnAppStart";

export default function Index() {
  const { startOnboarding, startAuth, startApp } = useOnAppStart();
  const router = useRouter();

  console.log(startApp, startAuth, startOnboarding);

  if (startApp) {
    router.replace("/(tabs)/home");
  }

  if (startAuth) {
    return <Auth />;
  }

  if (startOnboarding) {
    return <Onboarding />;
  }

  return null;
}
