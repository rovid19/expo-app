// components/GlobalPopup.tsx
import { Modal, View, Pressable } from "react-native";
import { usePopupStore } from "../../stores/popupStore";
import { BlurView } from "expo-blur";
import { useAppStore } from "../../stores/appStore";

interface GlobalPopupProps {
  content: React.ReactNode;
}
export default function GlobalPopup({ content }: GlobalPopupProps) {
  const { closeModal } = useAppStore();
  const { isModal } = useAppStore();
  const { requiresConfirmation } = usePopupStore();

  console.log("global popup", content);
  console.log(isModal);

  return (
    <View className="w-full h-full bg-dark1/50  justify-center items-center absolute top-0 left-0 right-0 bottom-0 z-50">
      <BlurView
        intensity={20}
        tint="dark"
        className="h-full w-full  absolute top-0 left-0 right-0 bottom-0 rounded-3xl z-0"
      />

      <Pressable
        onPress={() => {
          if (!requiresConfirmation) closeModal();
        }}
        className="w-full h-full justify-center items-center"
      >
        <View className="w-[90%] p-8 bg-dark1 rounded-3xl  border border-dark2/50">
          {content}
        </View>
      </Pressable>
    </View>
  );
}
