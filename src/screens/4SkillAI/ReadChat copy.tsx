// screens/LearningWithAI.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, Alert, FlatList, ScrollView
} from "react-native";
import Tts from 'react-native-tts';
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useChatlog } from "../../hooks/useChatlog";
import { startLessonAI, EndLessonAI, PauseLessonAI, postRecord } from "../../services/api/AI.services";
import { getUser } from "../../services/api/user.services";
import User from "../../models/user";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LessonStackParamList } from "../../navigation/AppStack";
import { getStatusBarHeight } from "react-native-status-bar-height";;

type Props = NativeStackScreenProps<LessonStackParamList, 'ReadChat'>;

Tts.setDefaultLanguage('en-US');
async function speak(text: string) {
  Tts.stop();
  Tts.setDefaultRate(0.5);
  Tts.speak(text); 
}

export default function ReadChat({ route, navigation }: Props) {
  const { type } = route.params;
  const flatRef = useRef<FlatList<any>>(null);

  const selectedLesson = useSelector((s: RootState) => s?.lesson.selectedLesson);
  const [user, setUser] = useState<User>();
  const [userInput, setUserInput] = useState('');
  const [content, setContent] = useState('');
  const [contentVisible, setContentVisible] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [sending, setSending] = useState(false);
  const [lessonEnded, setLessonEnded] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    getUser().then(d => setUser(d.data)).catch(console.error);
  }, []);

  const recordingOptions: Audio.RecordingOptions = {
    android: {
      extension: '.m4a',
      outputFormat: 2, // MPEG_4
      audioEncoder: 3, // AAC
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.caf',
      audioQuality: 127, // AVAudioQuality.high
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: 'audio/webm',
    },
  };

  const { data: messages = [], appendMessage, patchLastAIMessage } = useChatlog(user?._id, selectedLesson?._id);

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
        const d = await startLessonAI(user._id, selectedLesson._id, type);
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
  }, [user, selectedLesson, messages.length]);

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
            Speech.stop();
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
          Speech.stop();
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
      return () => { Speech.stop(); };
    }, [])
  );

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      flatRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // // Send answer
  // const handleSend = async () => {
  //   if (sending || !userInput.trim() || !selectedLesson?._id || !user?._id) return;
  //   setSending(true);

  //   const answer = userInput.trim();
  //   appendMessage({ from: "user", text: answer });
  //   setUserInput("");
  //   appendMessage({ from: "ai", text: "" });

  //   let fullText = "";
  //   try {
  //     fetchAIStream(
  //       { userId: user._id, lessonId: selectedLesson._id, userSpeechText: answer },
  //       parsed => {
  //         if (parsed.delta) {
  //           fullText += parsed.delta;
  //           patchLastAIMessage(parsed.delta);
  //         }
  //       },
  //       () => { if (fullText) speak(fullText); setSending(false); },
  //       () => { setLessonEnded(true); setSending(false); }
  //     );
  //   } catch (err) {
  //     setSending(false);
  //     console.error("fetchAIStream error:", err);
  //   }
  // };

  const startRecording = async () => {
      try {
        if (recording) {
          console.warn('Recording is already in progress');
          return;
        }
  
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
  
        const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
        setRecording(newRecording);
        setIsRecording(true);
      } catch (err) {
        console.log('Failed to start recording', err);
      }
    };
  
    const stopRecording = async () => {
      if (!recording) return;
  
      setIsRecording(false);
      try {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        // console.log('Recording saved at', uri);
        await sendAudio(uri || '');
        setRecording(null);
      } catch (err) {
        console.error('Failed to stop recording', err);
      }
    };
  
    const sendAudio = async (uri: string) => {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'audio.m4a',
        type: 'audio/m4a',
      } as any);

      console.log(formData);
  
      try {
        const res = await postRecord(formData);
        console.log('Server response:', res);
  
        // Giả lập AI trả lời, thêm vào chat
        if (res.responseText) {
          appendMessage({ text: res.responseText, from: 'ai' });
        }
      } catch (err: any) {
        console.error('Upload failed', err.message);
        Alert.alert('Upload failed', err.message);
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
                <Text style={[styles.messageText, isUser && { color: "#fff" }]}>
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

        {/* Input box */}
        {/* <View style={[styles.inputContainer, { paddingBottom: insets.bottom }]}>
          <TextInput
            value={userInput}
            onChangeText={setUserInput}
            placeholder="Your answer..."
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity disabled={sending} onPress={handleSend} style={[styles.sendButton, sending && { opacity: 0.5 }]}>
            <Ionicons name="send" size={22} color="#fff" />
          </TouchableOpacity>
        </View> */}
        {/* btn record */}
         <TouchableOpacity
            style={[styles.button, isRecording && styles.recording]}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Text style={styles.text}>{isRecording ? 'Recording...' : 'Hold to Record'}</Text>
          </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: getStatusBarHeight() + 10, backgroundColor: "#f5f5f5" },
  innerContainer: { flex: 1 },
  centerText: { flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 18 },
  title: { fontSize: 20, fontWeight: "bold", paddingHorizontal: 16, marginBottom: 8, color: "#333" },
  contentToggle: { fontSize: 16, color: "#007AFF", paddingHorizontal: 16, marginBottom: 8 },
  contentBox: { backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 12, padding: 12, maxHeight: 150, marginBottom: 12 },
  contentText: { fontSize: 16, color: "#333" },
  chatList: { paddingHorizontal: 16, paddingBottom: 8 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: "75%" },
  userBubble: { backgroundColor: "#007AFF", alignSelf: "flex-end" },
  aiBubble: { backgroundColor: "#E5E5EA", alignSelf: "flex-start" },
  messageText: { fontSize: 16, color: "#000" },
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
});
