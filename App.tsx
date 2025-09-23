import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { AuthProvider } from './src/hooks/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { checkOS, checkNetwork } from './src/utils/deviceCheck';

const queryClient = new QueryClient();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      // ✅ Check OS
      const { os, version } = checkOS();
      if (os === 'android' && parseInt(version, 10) < 10) {
        Alert.alert("Ứng dụng cần Android 10+");
        return; // dừng app hoặc điều hướng tới 1 màn hình khác
      }

      // ✅ Check network
      const online = await checkNetwork();
      if (!online) {
        Alert.alert("Không có kết nối internet");
      }

      setReady(true);
    };

    init();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' } as any}>
        <ActivityIndicator size="large" />
        <Text>Đang kiểm tra thiết bị...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 } as any}>
      <AuthProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <RootNavigator />
          </QueryClientProvider>
        </Provider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
