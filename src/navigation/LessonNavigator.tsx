import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LessonStackParamList } from "./AppStack";
import ListLesson from '../screens/4SkillAI/ListLesson';
import ListenChat from '../screens/4SkillAI/ListenChat';
import ReadChat from '../screens/4SkillAI/ReadChat';

const LessonStack = createNativeStackNavigator<LessonStackParamList>();

export function LessonStackNavigator() {
  return (
    <LessonStack.Navigator screenOptions={{ headerShown: false }}>
      <LessonStack.Screen name="ListLesson" component={ListLesson} />
      <LessonStack.Screen name="ListenChat" component={ListenChat} />
      <LessonStack.Screen name="ReadChat" component={ReadChat} />
    </LessonStack.Navigator>
  );
}
