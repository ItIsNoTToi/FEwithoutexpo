import DeviceInfo from 'react-native-device-info';
import { Platform, Dimensions, PixelRatio } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export const checkOS = () => {
  const os = Platform.OS;
  const version = DeviceInfo.getSystemVersion();
  return { os, version };
};

export const checkScreen = () => {
  const { width, height } = Dimensions.get('window');
  const scale = PixelRatio.get();
  return { width, height, scale };
};

export const checkNetwork = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export const checkHardware = async () => {
  const ram = await DeviceInfo.getTotalMemory();
  const storage = await DeviceInfo.getTotalDiskCapacity();
  return { ram, storage };
};
