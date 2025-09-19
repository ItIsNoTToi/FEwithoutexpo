import { AuthProvider } from './src/hooks/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/redux/store';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Khởi tạo 1 client React Query
const queryClient = new QueryClient();

// ✅ Đặt màu chữ mặc định an 

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
