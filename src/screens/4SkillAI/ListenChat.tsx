// screens/LearningWithAI.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, Alert, FlatList, ScrollView,
  TextInput,
  Animated
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useChatlog } from "../../hooks/useChatlog";
import { startLessonAI, EndLessonAI, PauseLessonAI, fetchAIStream } from "../../services/api/AI.services";
import { getUser } from "../../services/api/user.services";
import User from "../../models/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LessonStackParamList } from "../../navigation/AppStack";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Tts from 'react-native-tts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-community/voice';
import AsyncStorage from "@react-native-async-storage/async-storage";

type Mode = "idle" | "record" | "keyboard";
type Props = NativeStackScreenProps<LessonStackParamList, 'ListenChat'>;

Tts.setDefaultLanguage('en-US');
async function speak(text: string) {
  Tts.stop();
  Tts.setDefaultRate(0.5);
  Tts.speak(text); 
}

export default function ListenChat({ route, navigation }: Props) {
  const { type, resetCache } = route.params;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const flatRef = useRef<FlatList<any>>(null);
  const selectedLesson = useSelector((s: RootState) => s?.lesson.selectedLesson);
  const [user, setUser] = useState<User>();
  const [userInput, setUserInput] = useState('');
  const [content, setContent] = useState('');
  const [contentVisible, setContentVisible] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [sending, setSending] = useState(false);
  const [lessonEnded, setLessonEnded] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");
  const { data: messages = [], appendMessage, patchLastAIMessage } = useChatlog(user?._id, selectedLesson?._id);
  const [recognized, setRecognized] = useState("");
  const [pitch, setPitch] = useState<number>(0);
  const [error, setError] = useState("");
  const [end, setEnd] = useState("");
  const [started, setStarted] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [partialResults, setPartialResults] = useState<string[]>([]);

  useEffect(() => {
    getUser().then(d => setUser(d.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (resetCache) AsyncStorage.removeItem(`chatlog:${user?._id}:${selectedLesson?._id}`);
  }, [resetCache, user, selectedLesson]);
  
  useEffect(() => {
    Voice.onSpeechStart = (e: Event) => {
      console.log("onSpeechStart: ", e);
      setStarted("√");
    };

    Voice.onSpeechRecognized = (e: Event) => {
      console.log("onSpeechRecognized: ", e);
      setRecognized("√");
    };

    Voice.onSpeechEnd = onSpeechEnd;

    Voice.onSpeechError = (e: any) => {
      console.log("onSpeechError: ", e);
      setError(JSON.stringify(e.error));
    };

    Voice.onSpeechResults = (e: any) => {
      console.log("onSpeechResults: ", e);
      setResults(e.value);
    };

    Voice.onSpeechPartialResults = (e: any) => {
      console.log("onSpeechPartialResults: ", e);
      setPartialResults(e.value ?? []);
    };
    
    Voice.onSpeechVolumeChanged = (e: any) => {
      console.log("onSpeechVolumeChanged: ", e);
      setPitch(e.value ?? 0);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSpeechEnd = async (e: Event) => {
    console.log("onSpeechEnd: ", e);
      if (results.length > 0) {
        const bestGuess  = results[0];
        await sendMessage (bestGuess);
      }
      setEnd("√");
  }

  const sendMessage  = async (text: string) =>{
      if (text) {
      appendMessage({ from: "user", text: text});
      setUserInput("");
      appendMessage({ from: "ai", text: "" });

      let fullText = "";
      try {
        fetchAIStream(
          { userId: user?._id, lessonId: selectedLesson?._id, userSpeechText: text },
          parsed => {
            if (parsed.delta) {
              fullText += parsed.delta;
              patchLastAIMessage(parsed.delta);
            }
          },
          () => { if (fullText) speak(fullText); setSending(false); },
          () => { setLessonEnded(true); setSending(false); }
        );
      } catch (err) {
        setSending(false);
        console.error("fetchAIStream error:", err);
      }
      setUserInput("");
    }
  }

  const startRecognizing = async () => {
    setResults([]); 
    try {
      await Voice.start("en-US");
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecognizing = async () => {
    try {
      await Voice.stop();
      setMode("idle");
    } catch (e) {
      console.error(e);
    }
  };

  const cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  const destroyRecognizer = async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetStates();
  };

  const resetStates = () => {
    setRecognized("");
    setPitch(0);
    setError("");
    setStarted("");
    setResults([]);
    setPartialResults([]);
    setEnd("");
  };

  // Load user
  useEffect(() => {
    getUser().then(d => setUser(d.data)).catch(console.error);
  }, []);

  // Start lesson if no messages yet
  useEffect(() => {
    if (!user || !selectedLesson?._id || messages.length > 0) return;

    let mounted = true;
    (async () => {
      try {
        const d = await startLessonAI(user?._id, selectedLesson?._id, type);
        if (mounted) {
          setContent(d.content);
          Alert.alert("Info", d.message);
          appendMessage({ from: "ai", text: d.firstQuestion });
          speak(d.firstQuestion);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { mounted = false; };
  }, [user, selectedLesson, messages.length, appendMessage, type]);

  // Confirm before leaving
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (isEnding) return;

      e.preventDefault();
      Alert.alert("Xác nhận", "Bạn có muốn quay lại không?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Có",
          style: "destructive",
          onPress: async () => {
            Tts.stop();
            try {
              await PauseLessonAI(user?._id, selectedLesson?._id)
                .then(d => Alert.alert("Info", d.message))
                .catch(console.error);
            } catch (err) {
              console.error("Failed to Pause lesson:", err);
            }
            navigation.dispatch(e.data.action);
          },
        },
      ]);
    });
    return unsubscribe;
  }, [user, selectedLesson, navigation, isEnding]);

  const handleFinishLesson = async () => {
    Alert.alert("Xác nhận", "Bạn có muốn kết thúc bài học không?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Có",
        style: "destructive",
        onPress: async () => {
          setIsEnding(true);
          Tts.stop();
          if (!user?._id || !selectedLesson?._id) return;

          try {
            await EndLessonAI(user._id, selectedLesson._id)
              .then(d => Alert.alert("Info", d.message))
              .catch(console.error);
          } catch (err) {
            console.error("Failed to finish lesson:", err);
          }
          navigation.goBack();
        },
      },
    ]);
  };

  useFocusEffect(
    React.useCallback(() => {
      return () => { Tts.stop(); };
    }, [])
  );

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      flatRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Send answer
  const handleSend = async () => {
    if (sending || !userInput.trim() || !selectedLesson?._id || !user?._id) return;
    setSending(true);

    const answer = userInput.trim();
    appendMessage({ from: "user", text: answer });
    setUserInput("");
    appendMessage({ from: "ai", text: "" });

    let fullText = "";
    try {
      fetchAIStream(
        { userId: user._id, lessonId: selectedLesson._id, userSpeechText: answer },
        parsed => {
          if (parsed.delta) {
            fullText += parsed.delta;
            patchLastAIMessage(parsed.delta);
          }
        },
        () => { if (fullText) speak(fullText); setSending(false); },
        () => { setLessonEnded(true); setSending(false); }
      );
    } catch (err) {
      setSending(false);
      console.error("fetchAIStream error:", err);
    }
  };

  if (!selectedLesson) return <Text style={styles.centerText}>No lesson selected</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{selectedLesson.title} - {selectedLesson.type}</Text>

        {/* Lesson content toggle */}
        <TouchableOpacity onPress={() => setContentVisible(!contentVisible)}>
          <Text style={styles.contentToggle}>
            {contentVisible ? 'Hide Lesson Content' : 'Show Lesson Content'}
          </Text>
        </TouchableOpacity>

        {contentVisible && (
          <ScrollView style={styles.contentBox}>
            <Text style={styles.contentText}>{content}</Text>
          </ScrollView>
        )}

        {/* Chat messages */}
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(_, idx) => String(idx)}
          contentContainerStyle={styles.chatList}
          // Gọn hơn khi render message
          renderItem={({ item }) => {
            const isUser = item.from === "user";
            return (
              <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
                <Text style={[styles.messageText, isUser && { color: "#fff" }] as any}>
                  {item.text}
                </Text>
              </View>
            );
          }}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Finish button */}
        {lessonEnded && (
          <TouchableOpacity style={styles.finishButton} onPress={handleFinishLesson}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        )}

        {/* --- Controls --- */}
        <View >
          <Text style={{ color: '#000'} as any}>Welcome to React Native Voice!</Text>
          <Text style={{ color: '#000'} as any}>Press the button and start speaking.</Text>
          <Text style={{ color: '#000'} as any}>{`Started: ${started}`}</Text>
          <Text style={{ color: '#000'} as any}>{`Recognized: ${recognized}`}</Text>
          <Text style={{ color: '#000'} as any}>{`Pitch: ${pitch}`}</Text>
          <Text style={{ color: '#000'} as any}>{`Error: ${error}`}</Text>
          <Text style={{ color: '#000'} as any}>Results</Text>
          {results.map((result, index) => (
            <Text style={{ color: '#000'} as any} key={`result-${index}`}>{result}</Text>
          ))}
          <Text style={{ color: '#000'} as any}>Partial Results</Text>
          {partialResults.map((result, index) => (
            <Text style={{ color: '#000'} as any} key={`partial-result-${index}`}>{result}</Text>
          ))}
          <Text style={{ color: '#000'} as any}>{`End: ${end}`}</Text>
        </View>
        

        {/*  */}
        <View style={styles.controls}>
          {mode === "idle" && (
            <>
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "#007AFF" }] as any}
                onPress={() => { setMode("keyboard"); }}>
                <Ionicons name="keypad-outline" size={26} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "red" } as any]}
                onPress={() => { setMode("record"); startRecognizing(); }}>
                <Ionicons name="mic-outline" size={26} color="#fff" />
              </TouchableOpacity>
            </>
          )}

          {mode === "record" && (
            <View style={styles.row}>
              <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "red" }] as any}
                onPress={() => { stopRecognizing(); setMode("idle"); }}>
                <Ionicons name="stop-circle-outline" size={26} color="#fff" />
              </TouchableOpacity>
               <TouchableOpacity onPress={destroyRecognizer} style={[styles.circleBtn, { backgroundColor: "red" }] as any}>
                 <Ionicons name="remove-circle-outline" size={26} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "#999" }] as any}
                onPress={() => { cancelRecognizing(); setMode("idle"); }}>
                <Ionicons name="close" size={26} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          {mode === "keyboard" && (
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={userInput}
                onChangeText={setUserInput}
                placeholder="Type a message..."
              />
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "green" }] as any}
                onPress={handleSend}>
                <Ionicons name="send" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "#999" }] as any}
                onPress={() => setMode("idle")}>
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
         
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: getStatusBarHeight(), backgroundColor: "#f5f5f5" },
  innerContainer: { flex: 1 },
  centerText: { flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 18 },
  contentToggle: { fontSize: 16, color: "#007AFF", paddingHorizontal: 16, marginBottom: 8 },
  contentBox: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 12, padding: 12, maxHeight: 150, marginBottom: 12, color: '#000' },
  contentText: { fontSize: 16, color: "#333" },
  chatList: { paddingHorizontal: 16, paddingBottom: 8 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: "75%" },
  messageText: { fontSize: 16, color: "#000000ff" },
  inputContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 16, marginVertical: 8, backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#ccc", paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 10 : 6 },
  input: { flex: 1, fontSize: 16, color: "#333" },
  sendButton: { backgroundColor: "#007AFF", padding: 10, borderRadius: 24, marginLeft: 8 },
  finishButton: { paddingVertical: 12, backgroundColor: "red", borderRadius: 12, marginHorizontal: 16, marginBottom: 16, alignItems: "center" },
  finishButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
  },
  recording: { backgroundColor: '#f44336' },
  text: { color: 'white', fontWeight: 'bold' },
   title: { fontSize: 20, fontWeight: "bold", marginBottom: 8, textAlign: "center", color: '#000' },
  bubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: "80%" },
  userBubble: { backgroundColor: "#007AFF", alignSelf: "flex-end" },
  aiBubble: { backgroundColor: "#E5E5EA", alignSelf: "flex-start" },
  message: { fontSize: 16, color: "#000" },
  controls: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 12 },
  circleBtn: { padding: 12, borderRadius: 50, marginHorizontal: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: "red", marginRight: 12 },
  inputRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  textInput: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 12, color: '#000' },
  finishBtn: { padding: 12, backgroundColor: "red", borderRadius: 8, margin: 16 },
});
