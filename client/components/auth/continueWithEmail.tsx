import React, { useState } from "react";
import { Alert, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "react-native";
import Button from "../app/button";
import AuthFooter from "./authFooter";
import { AuthService } from "../../services/authService";
import { SvgXml } from "react-native-svg";
import { showPassword, hidePassword } from "../../assets/icons/icons";

interface ContinueWithEmailProps {
  setContinueWithEmail: (continueWithEmail: boolean) => void;
}

const continueWithEmail = ({
  setContinueWithEmail,
}: ContinueWithEmailProps) => {
  const [authType, setAuthType] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const disableMainButton =
    authType === "login" || authType === "createAccount"
      ? isLoading || email === "" || password === ""
      : authType === "resetPassword"
        ? isLoading || email === ""
        : false;

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await AuthService.login(email, password);
      setAuthType("login");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error logging in:", error);
      Alert.alert("Error logging in:", (error as Error).message);
    }

    setIsLoading(false);
  };

  const handleCreateAccount = async () => {
    setIsLoading(true);
    try {
      await AuthService.createAccount(email, password);
      setAuthType("login");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error creating account:", error);
      Alert.alert("Error creating account:", (error as Error).message);
    }

    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      await AuthService.resetPassword(email);
      setIsLoading(false);
      setAuthType("login");
      setEmail("");
      Alert.alert("Password reset email sent");
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error resetting password:", (error as Error).message);
    }

    setIsLoading(false);
  };

  return (
    <View className=" flex flex-col gap-8 px-2 flex-1 pt-20">
      <View className="flex flex-col gap-1 items-center justify-center">
        <Text className="text-5xl font-bold text-white">Welcome</Text>
        <Text className="text-lg text-light3 font-sans">
          {authType === "login"
            ? "Login to your account"
            : authType === "createAccount"
              ? "Create an account"
              : "Reset your password"}
        </Text>
      </View>

      <View className="w-full flex flex-col gap-4">
        <View className="w-full flex ">
          <Text className="text-light3 text-lg font-sans mb-2 px-4">Email</Text>
          <TextInput
            className="w-full p-4 rounded-3xl bg-dark2 border border-dark3 text-light2"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#5D5D5D"
          />
        </View>
        {authType !== "resetPassword" && (
          <View className="w-full flex">
            <Text className="text-light3 text-lg font-sans mb-2 px-4">
              Password
            </Text>
            <View className="relative">
              <TextInput
                className="w-full p-4 rounded-3xl bg-dark2 border border-dark3 text-light2"
                secureTextEntry={!passwordVisible}
                placeholder="Enter your password"
                placeholderTextColor="#5D5D5D"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-1/2 -translate-y-1/2"
                onPress={() => setPasswordVisible(!passwordVisible)}
              >
                <SvgXml
                  xml={passwordVisible ? showPassword : hidePassword}
                  width={24}
                  height={24}
                  color="#999999"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {authType === "login" && (
          <View className="w-full flex justify-center items-center">
            <Text
              className="text-light3 text-sm font-sans"
              onPress={() => setAuthType("resetPassword")}
            >
              Forgot password?
            </Text>
          </View>
        )}
      </View>
      <View className="w-full flex items-center justify-center">
        <Button
          title={
            authType === "login"
              ? "Continue"
              : authType === "createAccount"
                ? "Create account"
                : "Continue"
          }
          onPress={
            authType === "login"
              ? handleLogin
              : authType === "createAccount"
                ? handleCreateAccount
                : handleResetPassword
          }
          backgroundColor="bg-accent1"
          textColor="text-dark1"
          bold={true}
          animation={isLoading}
          animationText={
            authType === "resetPassword"
              ? "Sending..."
              : authType === "createAccount"
                ? "Creating account..."
                : "Logging in..."
          }
          disabled={disableMainButton}
        />
      </View>

      <View className="h-8 w-full flex flex-row gap-2 py-2 px-2">
        <View className="h-full w-[45%] rounded-l-full flex items-center justify-center py-1">
          <View className="h-full w-full bg-dark2/30 rounded-l-full"></View>
        </View>
        <View className="flex-1 flex items-center justify-center">
          <Text className="text-sm font-sans text-light3 text-center ">OR</Text>
        </View>

        <View className="h-full w-[45%] rounded-r-full flex items-center justify-center py-1">
          <View className="h-full w-full bg-dark2/30 rounded-r-full"></View>
        </View>
      </View>

      <Button
        title={
          authType === "login"
            ? "Create an account"
            : authType === "createAccount"
              ? "Login to your account"
              : "Back to login"
        }
        onPress={() => {
          if (authType === "login") {
            setAuthType("createAccount");
          } else {
            setAuthType("login");
          }
        }}
        backgroundColor="bg-dark2"
        textColor="light2"
      />

      <AuthFooter />
      <View className="h-10 w-full"></View>
    </View>
  );
};

export default continueWithEmail;
