import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Auth/login';
import Register from '../screens/Auth/register';
import LoginWithPhone from '../screens/Auth/loginwithphone';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoginWithPhone" component={LoginWithPhone} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}
