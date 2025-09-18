import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TournamentStackParamList } from "./AppStack";
import CompetitionScreen from "../screens/Extends/CompetitionScreen";
import TournamentDetailScreen from "../screens/Extends/TournamentDetail";

const TournamentStack = createNativeStackNavigator<TournamentStackParamList>();

export function TournamentTabs() {
  return (
    <TournamentStack.Navigator screenOptions={{ headerShown: false }}>
      <TournamentStack.Screen 
        name="Tournament" 
        component={CompetitionScreen} 
        options={{ title: 'Tournament' }} 
      />
      <TournamentStack.Screen 
        name="TournamentDetail" 
        component={TournamentDetailScreen} 
        options={{ title: 'Tournament Detail' }} 
      />
    </TournamentStack.Navigator>
  );
}