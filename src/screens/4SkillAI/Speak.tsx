
import React, { useEffect, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Platform, KeyboardAvoidingView, ScrollView
} from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Voice from '@react-native-community/voice';
import LoadingSpinner from "../../features/LoadingSpinner";
import { getUser } from "../../services/api/user.services";
import { FetchRateSpeak, GetRandomSentence } from "../../services/api/speak.services";
import User from "../../models/user";

export const Speak = () => {
  const [user, setUser] = useState<User>();
  const [level, setLevel] = useState<string>("");
  const [sentence, setSentence] = useState<string>("");
  const [recording, setRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [results, setResults] = useState<string>("");

  useEffect(() => {
    getUser().then(d => {
      setUser(d.data);
      setLevel(d.data?.UserDetail?.level || "beginner");
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (level) fetchSentence(level);
  }, [level]);

  const fetchSentence = async (lv: string) => {
    try {
      const data: any = await GetRandomSentence(lv);
      setSentence(data.data);
      setScore(null);
      setFeedback("");
      setResults("");
    } catch (e: any) {
      setSentence("Hello! How are you today?");
    }
  };

  useEffect(() => {
    Voice.onSpeechResults = async (e: any) => {
      const text = e.value[0];
      setResults(text);
      await fetchPoint(sentence, text);
      setRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [sentence]);

  const startRecording = async () => {
    setRecording(true);
    setResults("");
    try { await Voice.start("en-US"); } catch (e) { console.error(e); }
  };

  const stopRecording = async () => {
    setRecording(false);
    try { await Voice.stop(); } catch (e) { console.error(e); }
  };

  const cancelRecording = async () => {
    setRecording(false);
    try { await Voice.cancel(); } catch (e) { console.error(e); }
  };

  const fetchPoint = async (original: string, student: string) => {
    try {
      const data: any = await FetchRateSpeak(original, student);
      setScore(data.score);
      setFeedback(data.feedback);
    } catch (e: any) {
      setFeedback("Error evaluating speech");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Speak Practice</Text>
        <Text style={styles.subtitle}>Hi {user?.UserDetail?.FirstName || "Student"}</Text>

        {/* Sentence */}
        <View style={styles.sentenceBox}>
          <Text style={styles.sentence}>{sentence}</Text>
          <TouchableOpacity onPress={() => fetchSentence(level)}>
            <Text style={styles.otherSentence}>Other sentence</Text>
          </TouchableOpacity>
        </View>

        {/* Results */}
        {results ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>You said: {results}</Text>
            {score !== null && <Text style={styles.resultText}>Score: {score}</Text>}
            {feedback && <Text style={styles.feedback}>{feedback}</Text>}
          </View>
        ) : null}

        {/* Controls */}
        <View style={styles.controls}>
          {!recording ? (
            <TouchableOpacity style={styles.circleBtn} onPress={startRecording}>
              <Ionicons name="mic-outline" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.recordingRow}>
              <LoadingSpinner size={30} color="#FF6B6B" thickness={4} />
              <TouchableOpacity style={styles.circleBtn} onPress={stopRecording}>
                <Ionicons name="stop-circle-outline" size={28} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleBtn, { backgroundColor: "#999" }] as any} onPress={cancelRecording}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0c2e", // galaxy dark
    paddingTop: getStatusBarHeight(),
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#00ffff", marginBottom: 4 },
  subtitle: { fontSize: 18, color: "#ffffffaa", marginBottom: 16 },

  sentenceBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  sentence: { fontSize: 18, color: "#fff", textAlign: "center", marginBottom: 8 },
  otherSentence: { color: "#4FACFE", fontSize: 16 },

  resultBox: {
    width: "100%",
    backgroundColor: "rgba(127,0,255,0.2)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultText: { fontSize: 16, color: "#fff" },
  feedback: { fontSize: 16, color: "#00ff99", marginTop: 4 },

  controls: { flexDirection: "row", justifyContent: "center", marginBottom: 16 },
  circleBtn: {
    backgroundColor: "#E100FF",
    padding: 20,
    borderRadius: 50,
    marginHorizontal: 8,
    shadowColor: "#00F2FE",
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  recordingRow: { flexDirection: "row", alignItems: "center" },
});
