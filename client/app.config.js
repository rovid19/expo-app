module.exports = {
  expo: {
    name: "dexly",
    slug: "dexly",
    scheme: "dexly",
    version: "1.0.0",

    updates: {
      url: "https://u.expo.dev/1451b288-3ed4-46f8-b4b9-082485d6da60",
    },
    runtimeVersion: {
      policy: "appVersion",
    },

    extra: {
      eas: {
        projectId: "984d6692-ba6a-4607-a8e0-335cec4e0fdf",
      },
    },

    orientation: "portrait",
    icon: "./assets/DarkAppIcon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-dexly.png",
      resizeMode: "contain",
      backgroundColor: "#0D0D0D",
    },
    ios: {
      usesAppleSignIn: true,
      bundleIdentifier: "com.dexlyscanner.app",
      supportsTablet: false,
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to scan items.",
        NSPhotoLibraryUsageDescription: "Upload photos to Facebook Marketplace",
        NSPhotoLibraryAddUsageDescription: "Save images to your photo library",
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: false,
        },
      },
      icon: {
        light: "./assets/LightAppIcon.png",
        dark: "./assets/DarkAppIcon.png",
      },
    },
    android: {
      package: "com.dexlyscanner.app",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["CAMERA", "READ_MEDIA_IMAGES", "WRITE_EXTERNAL_STORAGE"],
    },
    web: {
      favicon: "./assets/DarkAppIcon.png",
    },
    plugins: ["expo-router", "expo-av"],
  },
};
