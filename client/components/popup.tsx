// components/GlobalPopup.tsx
import { Modal, View, Pressable } from "react-native";
import { usePopupStore } from "../stores/popupStore";
import { BlurView } from "expo-blur";
export default function GlobalPopup() {
  const { visible, content, close, isFullscreen } = usePopupStore();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close} // Android back button
    >
      <Pressable
        onPress={close}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BlurView
          intensity={20}
          tint="dark"
          className="h-full w-full  absolute top-0 left-0 right-0 bottom-0 rounded-3xl z-0"
        />
        <Pressable
          onPress={() => {}}
          className={`${
            isFullscreen ? "w-full h-full" : "w-[90%]"
          } bg-dark1 rounded-3xl p-8 border border-dark2/50`}
        >
          {content}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
