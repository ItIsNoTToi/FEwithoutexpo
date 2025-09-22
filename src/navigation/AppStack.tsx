import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faRobot, faUser, faTrophy, faPen } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

// screens
import HomeScreen from '../screens/index';
import ProfileScreen from '../screens/ProfileScreen';
import RankingScreen from '../screens/Extends/RankingScreen';
import VocabularyPage from '../screens/Extends/Vocabulary';

// model
import Lesson from '../models/lesson';

// Other navigation
import { QuizTabs } from './QuizNavigator';
import { TournamentTabs } from './TournamentNavigator';
import { LessonStackNavigator } from './LessonNavigator';
import { Write } from '../screens/4SkillAI/Write';
import { Read } from '../screens/4SkillAI/Read';
import { Speak } from '../screens/4SkillAI/Speak';
import { Listen } from '../screens/4SkillAI/Listen';
import { fixSentence } from '../screens/fixSentence';

export type QuizStackParamList = {
  QuizTopic: undefined;
  QuizTest: { quizId: string;};
  Result: { score: number; total: number; totalscore: number; quizId: string; };
}

export type ReadStackParamList = {
  ReadingTopics: undefined;
  ReadingDetail: { item: Lesson }
}

export type TournamentStackParamList = {
  Tournament: undefined;
  TournamentDetail: { tournamentId: string };
}

export type LessonStackParamList = {
  ListLesson: undefined;
  ListenChat: { type: string, resetCache: boolean }
  ReadChat: { type: string, resetCache: boolean }
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator  screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: "#020c16ff",   // màu khi tab active
    tabBarInactiveTintColor: "#06a144ff",   // màu khi tab không active
  }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHome as IconProp} color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="LessonStackNavigator"
        component={LessonStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "ListLesson";

          // Nếu không phải ở màn ListLesson thì ẩn tab bar
          if (
            routeName === "ListenChat" ||
            routeName === "ReadChat"
          ) {
            return {
              title: "Chat with AI",
              tabBarStyle: { display: "none" },
              tabBarIcon: ({ color, size }) => (
                <FontAwesomeIcon icon={faRobot as IconProp} color={color} size={size} />
              ),
            };
          }

          return {
            title: "Chat with AI",
            tabBarIcon: ({ color, size }) => (
              <FontAwesomeIcon icon={faRobot as IconProp} color={color} size={size} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="FixSentence"
        component={fixSentence}
        options={{
          title: 'Fix Sentence',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faPen as IconProp} color={color} size={size as number} />
          ),
        }}
      />
      <Tab.Screen
        name="Competition"
        component={TournamentTabs}
        options={{
          title: 'Competition',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faTrophy as IconProp} color={color} size={size as number} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser as IconProp} color={color} size={size as number} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <Stack.Navigator>
      {/* Tabs là màn chính */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      {/* Màn phụ - mở từ ListLesson */}
      <Stack.Screen
        name="QuizTest"
        component={QuizTabs}
        options={{ title: 'Quiz', headerShown: false }}
      />
      <Stack.Screen
        name="Write"
        component={Write}
        options={{ title: 'Write', headerShown: false }}
      />
      <Stack.Screen
        name="Read"
        component={Read}
        options={{ title: 'Read', headerShown: false }}
      />
      <Stack.Screen
        name="Vocabulary"
        component={VocabularyPage}
        options={{ title: 'Vocabulary', headerShown: false }}
      />
      <Stack.Screen
        name="Listen"
        component={Listen}
        options={{ title: 'Listen', headerShown: false }}
      />
      <Stack.Screen
        name="Speak"
        component={Speak}
        options={{ title: 'Speak', headerShown: false }}
      />
      <Stack.Screen
        name="Ranking"
        component={RankingScreen}
        options={{ title: 'Ranking', headerShown: false }}
      />
    </Stack.Navigator>
  );
}