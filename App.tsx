import { AuthProvider } from './src/hooks/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from "react-native";

// Khởi tạo 1 client React Query
const queryClient = new QueryClient();

// ✅ Đặt màu chữ mặc định an 
const TextAny = Text as any;

if (!TextAny.defaultProps) {
  TextAny.defaultProps = {};
}
TextAny.defaultProps.style = {
  ...(TextAny.defaultProps.style || {}),
  color: "#000",
}

export default function App() {
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
