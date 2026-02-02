import {
  View,
  Text,
  Pressable,
  TextInput,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import {
  useMemo,
  forwardRef,
  useState,
  useCallback,
  useRef,
  RefObject,
} from "react";
import api from "../../lib/axios";
import colors from "tailwindcss/colors";
import { useAppStore } from "../../stores/appStore";

const ReportBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const [sendingReport, setSendingReport] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const snapPoints = useMemo(() => ["85%"], []);
  const [description, setDescription] = useState("");
  const maxLength = 500;
  const descriptionInputRef = useRef<TextInput>(null);
  const { setHideNavbar } = useAppStore();

  const dismissKeyboard = useCallback(() => {
    descriptionInputRef.current?.blur();
    Keyboard.dismiss();
  }, []);

  const handleSendReport = async () => {
    setSendingReport(true);
    await api.post("/profile/send-report", { description });
    dismissKeyboard();
    setShowConfirmationMessage(true);
    setDescription("");
    setSendingReport(false);
  };

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      enableDynamicSizing={false}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={{ backgroundColor: "#262626" }}
      backgroundStyle={{
        backgroundColor: "#0D0D0D",
        borderWidth: 1,
        borderColor: "#1A1A1A",
        borderRadius: 16,
      }}
      onChange={(index) => {
        if (index === -1) dismissKeyboard();
      }}
      onClose={dismissKeyboard}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
        />
      )}
      onAnimate={(_, toIndex) => {
        if (toIndex === -1) {
          setHideNavbar(false);
        
        }
      }}

    >
      {showConfirmationMessage && (
        <View className="absolute top-0 left-0 bg-white h-full w-full z-10 items-center justify-center">
          <View className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
            <Text className="text-2xl font-bold tracking-tight text-neutral-950">
              Report sent
            </Text>
            <Text className="text-sm text-neutral-500 tracking-tight text-center">
              Thank you for your report. We will review it and get back to you
              as soon as possible.
            </Text>

            <Pressable
              className="bg-black py-4 rounded-2xl mt-4 px-8"
              onPress={() => {
                setShowConfirmationMessage(false);
                (ref as RefObject<BottomSheet>).current?.close();
              }}
            >
              <Text className="text-white text-center font-semibold">
                Close
              </Text>
            </Pressable>
          </View>
        </View>
      )}
      <BottomSheetView className="flex-1 px-4 pt-2 relative ">
        <Pressable
          className="flex-1"
          onPress={dismissKeyboard}
          accessible={false}
        >
          {/* Header */}
          <View className="pt-2 pb-3">
            <Text className="text-2xl font-bold tracking-tight text-light2">
              Report a bug
            </Text>
            <Text className="text-sm text-light3 tracking-tight mt-1 font-sans">
              Tell us what went wrong and how we can reproduce it.
            </Text>
          </View>

          {/* Content */}
          <View className="flex-1 mt-2">
            <Text className="text-sm font-sans text-light2 mb-2">
              Description
            </Text>
            <View className=" rounded-2xl bg-dark2 px-4 py-3">
              <TextInput
                ref={descriptionInputRef}
                value={description}
                onChangeText={setDescription}
                placeholder="What happened? What did you expect to happen? Steps to reproduce…"
                placeholderTextColor="#999999"
                multiline
                maxLength={maxLength}
                textAlignVertical="top"
                className="min-h-[160px] text-base text-light2 font-sans"
              />
              <Text className="text-xs text-light3 self-end mt-2 font-sans">
                {description.length}/{maxLength}
              </Text>
            </View>
          </View>

          {/* CTA */}
          <Pressable
            className="bg-accent1 py-4 rounded-full mt-4"
            onPress={async () => {
              if (description.length > 5) {
                await handleSendReport();
              } else {
                Alert.alert(
                  "Please enter a description of at least 5 characters"
                );
              }
            }}
          >
            {sendingReport ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text className="text-dark1 text-center font-bold">
                Send report
              </Text>
            )}
          </Pressable>
        </Pressable>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default ReportBottomSheet;
