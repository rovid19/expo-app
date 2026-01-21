import { Keyboard, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useKeyboardHeight() {
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const onShow = (e: any) => {
      const keyboardHeight = e.endCoordinates?.height ?? 0;

      // iOS reports keyboard INCLUDING safe area
      const adjusted =
        Platform.OS === "ios"
          ? Math.max(0, keyboardHeight - insets.bottom)
          : keyboardHeight;

      setHeight(adjusted);
      console.log("keyboardHeight", adjusted);
    };

    const onHide = () => setHeight(0);

    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillChangeFrame" : "keyboardDidShow",
      onShow
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      onHide
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  return height;
}
