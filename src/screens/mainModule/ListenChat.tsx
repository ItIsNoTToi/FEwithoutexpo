
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, Alert, FlatList,
  TextInput, Animated
} from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import {retakeLessonApi} from "../../services/api/AI.services";
import { BackHandler } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LessonStackParamList } from "../../navigation/AppStack";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Tts from "react-native-tts";
import Ionicons from "react-native-vector-icons/Ionicons";
import Voice from "@react-native-community/voice";
import LoadingSpinner from "../../features/LoadingSpinner";
import { useResetChatlog } from "../../hooks/useResetChatlog";
// import { speak } from "../../services/api/speak.services";
import { useAILesson } from "../../hooks/useAILesson";
import { getdataLesson } from "../../services/api/lesson.services";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Mode = "idle" | "record" | "keyboard";
type Props = NativeStackScreenProps<LessonStackParamList, "reading">;

export default function ListenChat({ route, navigation }: Props) {
  const { type, lessonmode } = route.params;
  const userId = useSelector((s: RootState) => s.user._id);
  const lesson = useSelector((s: RootState) => s.lesson.Lesson);
  const {messages, loading, sending, lessonEnded, content, startLesson, PauseLesson, sendMessage, finishLesson } = useAILesson({userId, lesson, type});
  const [userInput, setUserInput] = useState("");
  const [contentVisible, setContentVisible] = useState(true);
  const [mode, setMode] = useState<Mode>("idle");
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const isMounted = useRef(true);
  const flatRef = useRef<FlatList<any>>(null);
  const { resetChatlog } = useResetChatlog();
  const progress = useSelector((state: RootState) => state.progress.progress);
  const [totalSteps, settotalstep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const allowExitRef = useRef(false);
  useEffect(() => {
    (async () => {
      const keys = await AsyncStorage.getAllKeys();
      const data = await AsyncStorage.multiGet(keys);
      // console.log('🧠 AsyncStorage:', data);
    })();
  }, []);

  useEffect(() => {
    getdataLesson(lesson?._id)
    .then(res => {
      if (res.data) {
        settotalstep(res?.data?.steps?.length);
      }
    })
  }, [lesson]);

  useEffect(() => {
    if (!lesson || !progress || !totalSteps) return;
    const pg = progress.Listlesson.find(
      p => String(p.lesson) === String(lesson?._id)
    );
    setIsFinished(
      pg?.status === 'passed' ||
      pg?.step! >= totalSteps - 1
    );
    // console.log(totalSteps);
  }, [lesson, progress, totalSteps]);

  switch (lessonmode) {
    case 'new':
      startLesson();
      break;

    case 'replay':
      resetChatlog(String(userId), String(lesson?._id));
      startLesson();
      break;

    case 'continue':
      if (isFinished) {
        startLesson();
      } else {
        // loadChatlog();
      }
      break;
  }
  
  /* ---------- animation ---------- */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true })
      ])
    ).start();
  }, []);
  /* ---------- cleanup ---------- */
  useEffect(() => {
    return () => {
      isMounted.current = false;
      Tts.stop();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);
  /* ---------- reset & replay ---------- */
  // useEffect(() => {
  //   // if (resetCache && userId && lesson?._id) {
  //   //   Promise.all([
  //   //     resetChatlog(userId, lesson._id),
  //   //     retakeLessonApi(userId, lesson._id)
  //   //   ]).then(() => fetchStart());
  //   // }
  // }, [resetCache, userId, lesson?._id]);
  /* ---------- voice ---------- */
  useEffect(() => {
    Voice.onSpeechResults = async (e: any) => {
      if (e?.value?.[0]) {
        await sendMessage(e.value[0]);
      }
      setMode("idle"); // ✅ QUAY LẠI
    };
    Voice.onSpeechEnd = () => {
      setMode("idle"); // ✅ backup
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (allowExitRef.current) {
        // ✅ cho phép thoát, KHÔNG pause
        return;
      }

      e.preventDefault();

      Alert.alert("Xác nhận", "Bạn có muốn tạm dừng không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            await Tts.stop();
            await PauseLesson();
            allowExitRef.current = true; // ✅ mở khóa
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });

    return unsubscribe;
  }, []);
  
  const handleFinishLesson = async () => {
    Alert.alert("Xác nhận", "Bạn có muốn kết thúc bài học không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          await Tts.stop();
          allowExitRef.current = true; // 🔥 QUAN TRỌNG
          await finishLesson();
          navigation.goBack();
        },
      },
    ]);
  };

  const handleSend = async () => {
    if (!userInput.trim()) return;

    await sendMessage(userInput.trim());
    setUserInput(""); // ✅ CLEAR INPUT
  };

  if (!lesson) return <Text style={styles.centerText}>No lesson</Text>;
  if (!userId) return <Text style={styles.centerText}>Loading user...</Text>;
  if (loading) return <Text style={styles.centerText}>Loading lesson...</Text>;
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <Text style={styles.title}>{lesson.title}</Text>

      <View style={styles.progressBg}>
        <Animated.View style={[styles.progressFill, { width: `100%` }]} />
      </View>

      <TouchableOpacity onPress={() => setContentVisible(!contentVisible)}>
        <Text style={styles.contentToggle}>
          {contentVisible ? "Hide Scroll" : "Read Scroll"}
        </Text>
      </TouchableOpacity>

      {contentVisible && (
        <View style={styles.contentBox}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
      )}

      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={item.from === "user" ? styles.userBubble : styles.aiBubble}>
            {item.loading
              ? <LoadingSpinner size={24} />
              : <Text style={styles.messageText}>{item.text}</Text>}
          </View>
        )}
      />

      <View style={styles.controls}>
        {mode === "idle" && (
          <>
            <TouchableOpacity onPress={() => setMode("keyboard")}>
              <Ionicons name="keypad-outline" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setMode("record"); Voice.start("en-US"); Tts.stop() }}>
              <Ionicons name="mic-outline" size={28} color="red" />
            </TouchableOpacity>
          </>
        )}
        {mode === "keyboard" && (
          <>
            <TextInput
              style={styles.input}
              value={userInput}
              onChangeText={setUserInput}
              onSubmitEditing={handleSend}
              onBlur={() => setMode("idle")} 
            />
            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={24} color="green" />
            </TouchableOpacity>
          </>
        )}
        {mode === "record" && (
          <TouchableOpacity
            onPress={() => {
              Voice.stop();
              setMode("idle");
            }}
          >
            <Ionicons name="stop-circle-outline" size={36} color="red" />
          </TouchableOpacity>
        )}
      </View>
      {lessonEnded && (
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishLesson}>
          <Text style={styles.finishText}>Finish Lesson</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: getStatusBarHeight(), backgroundColor: "#0b0c2a" },
  centerText: { color: "#fff", textAlign: "center", marginTop: 40 },
  title: { color: "#fff", fontSize: 22, textAlign: "center", marginBottom: 8 },
  progressBg: { height: 6, backgroundColor: "#222", borderRadius: 3 },
  progressFill: { height: 6, backgroundColor: "#7F00FF" },
  contentToggle: { color: "#4FACFE", textAlign: "center", marginVertical: 8 },
  contentBox: { padding: 12, backgroundColor: "#111", borderRadius: 10 },
  contentText: { color: "#fff" },
  userBubble: { alignSelf: "flex-end", backgroundColor: "#4FACFE", padding: 10, margin: 6, borderRadius: 12 },
  aiBubble: { alignSelf: "flex-start", backgroundColor: "#7F00FF", padding: 10, margin: 6, borderRadius: 12 },
  messageText: { color: "#fff" },
  controls: { flexDirection: "row", justifyContent: "center", gap: 20, margin: 12 },
  input: { flex: 1, borderWidth: 1, borderColor: "#4FACFE", color: "#fff", padding: 8 },
  finishButton: { backgroundColor: "#E100FF", padding: 12, margin: 16, borderRadius: 10 },
  finishText: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
