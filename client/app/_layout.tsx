import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabase/supabaseClient";
import { useUserStore } from "../stores/userStore";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import GlobalPopup from "../components/popup/popup";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useListingDetailsStore } from "../stores/listingDetailsStore";
import { Modal } from "react-native";
import Toast from "react-native-toast-message";
import toastConfig from "../components/app/toastConfig";
import ListingDetailsBottomSheet from "../components/listingDetails/index";
import { useAppStore } from "../stores/appStore";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const setUser = useUserStore((state) => state.setUser);
  const { setListingDetailsBottomSheetRef } = useListingDetailsStore();
  const listingDetailsBottomSheetRef = useRef<BottomSheetModal>(null);
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });
  const { isModal, closeModal } = useAppStore();

  useEffect(() => {
    setListingDetailsBottomSheetRef(
      listingDetailsBottomSheetRef as React.RefObject<BottomSheetModal>
    );
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!loaded) {
    return null;
  }

  if (isLoading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <Modal
        visible={isModal?.visible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => closeModal()}
      >
        {isModal?.content}
        {isModal?.popupContent && (
          <GlobalPopup content={isModal.popupContent} />
        )}
      </Modal>
      <ListingDetailsBottomSheet ref={listingDetailsBottomSheetRef} />
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}

//    <GlobalPopup />
/*   <Modal
        visible={isFacebookModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsFacebookModalVisible(false)}
      >
        <FacebookMarketplacePost
          listing={item as Item}
          onClose={() => setIsFacebookModalVisible(false)}
        />
      </Modal>
      <Modal
        visible={isAdditionalPhotosModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsAdditionalPhotosModalVisible(false)}
      >
        <AddAdditionalImages />
      </Modal>
      <Modal
        visible={isEditListingModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setIsEditListingModalVisible(false)}
      >
        <EditListing />
      </Modal>*/
