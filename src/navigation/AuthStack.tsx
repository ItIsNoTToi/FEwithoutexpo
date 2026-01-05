import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Auth/login';
import Register from '../screens/Auth/register';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
