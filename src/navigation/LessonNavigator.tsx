import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LessonStackParamList } from "./AppStack";
import ListLesson from '../screens/mainModule/ListLesson';
import ListenChat from '../screens/mainModule/ListenChat';
import ReadChatRPG from '../screens/mainModule/ReadChat';
import Topic from "../screens/mainModule/Topic";

const LessonStack = createNativeStackNavigator<LessonStackParamList>();

export function LessonStackNavigator() {
  return (
    <LessonStack.Navigator screenOptions={{ headerShown: false }}>
      <LessonStack.Screen name="ListLesson" component={ListLesson} />
      <LessonStack.Screen name="listening" component={ListenChat} />
      <LessonStack.Screen name="reading" component={ReadChatRPG} />
      <LessonStack.Screen name="topic" component={Topic} />
    </LessonStack.Navigator>
  );
}
