import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import { useAuth } from '../hooks/AuthContext'; // Assuming you have a custom hook for auth state

export default function RootNavigator() {
    const { isLoggedIn } = useAuth();

    return (
        <NavigationContainer>
        {isLoggedIn ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
