import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QuizStackParamList } from "./AppStack";
import ListQuizTopic from "../screens/Extends/ListQuizTopic";
import QuizTest from "../screens/Extends/QuizTest";
import ResultScreen from "../screens/Extends/ResultScreen";

const QuizStack = createNativeStackNavigator<QuizStackParamList>();

export function QuizTabs() {
  return (
    <QuizStack.Navigator screenOptions={{ headerShown: false }}>
      <QuizStack.Screen
        name="QuizTopic"
        component={ListQuizTopic}
        options={{ title: 'Quiz Topic' }}
      />
      <QuizStack.Screen
        name="QuizTest"
        component={QuizTest}
        options={{ title: 'Quiz Test' }}
      />
      <QuizStack.Screen
        name="Result"
        component={ResultScreen}
        options={{ title: 'Result' }}
      />
    </QuizStack.Navigator>
  );
}