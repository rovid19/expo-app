import React, { useMemo, useState } from "react";
import { CameraDevice, useCameraDevices } from "react-native-vision-camera";

const useCameraDevicesHook = () => {
  const devices = useCameraDevices();
  const [currentDevice, setCurrentDevice] = useState<CameraDevice | undefined>(
    devices[0]
  );

  // Get all back devices
  const backDevices: CameraDevice[] = useMemo(() => {
    return Array.isArray(devices)
      ? devices.filter((d) => d.position === "back")
      : (devices as any)?.back
      ? [(devices as any).back as CameraDevice]
      : [];
  }, [devices]);

  // Find specific lens devices (prioritize single-lens devices)
  const wideDevice = useMemo(
    () =>
      backDevices.find(
        (d) =>
          d.physicalDevices?.length === 1 &&
          d.physicalDevices[0] === "ultra-wide-angle-camera"
      ),
    [backDevices]
  );
  const normalDevice = useMemo(
    () =>
      backDevices.find(
        (d) =>
          d.physicalDevices?.length === 1 &&
          d.physicalDevices[0] === "wide-angle-camera"
      ),
    [backDevices]
  );
  const telephotoDevice = useMemo(
    () =>
      backDevices.find(
        (d) =>
          d.physicalDevices?.length === 1 &&
          d.physicalDevices[0] === "telephoto-camera"
      ),
    [backDevices]
  );

  return {
    currentDevice,
    setCurrentDevice,
    backDevices,
    wideDevice,
    normalDevice,
    telephotoDevice,
  };
};

export default useCameraDevicesHook;
