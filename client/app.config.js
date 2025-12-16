module.exports = {
  expo: {
    name: "client",
    slug: "client",
    scheme: "client",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      usesAppleSignIn: true,
      bundleIdentifier: "com.rovid19.client",
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "This app uses the camera to scan items.",
        NSPhotoLibraryUsageDescription: "Upload photos to Facebook Marketplace",
        NSPhotoLibraryAddUsageDescription: "Save images to your photo library",
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: false,
          NSExceptionDomains: {
            "facebook.com": {
              NSIncludesSubdomains: true,
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSExceptionRequiresForwardSecrecy: false,
            },
            "fbcdn.net": {
              NSIncludesSubdomains: true,
              NSExceptionAllowsInsecureHTTPLoads: true,
              NSExceptionRequiresForwardSecrecy: false,
            },
          },
        },
      },
    },
    android: {
      package: "com.rovid19.client",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: ["CAMERA", "READ_MEDIA_IMAGES", "WRITE_EXTERNAL_STORAGE"],
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-router"],
  },
};
