import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import { getRandomTitle, submitWriting } from "../../services/api/AI.services";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

// Simple in-memory cache for titles
const titleCache: { [key: string]: string } = {};

export const Write = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState("");
  const [loadingTitle, setLoadingTitle] = useState(false);
  const [text, setText] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);

  // Fetch AI-assigned title
  const fetchTitle = async () => {
    setLoadingTitle(true);
    const cacheKey = "randomTitle_default";
    if (titleCache[cacheKey]) {
      setTitle(titleCache[cacheKey]);
      setLoadingTitle(false);
      return;
    }
    try {
      const data = await getRandomTitle();
      const newTitle = data.title || "Default Title";
      titleCache[cacheKey] = newTitle;
      setTitle(newTitle);
    } catch (err) {
      console.error("Failed to get random title:", err);
      setTitle("Default Title");
    } finally {
      setLoadingTitle(false);
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return Alert.alert("Warning", "Please enter your writing.");
    setLoadingSubmit(true);
    try {
      const result = await submitWriting(title, text);

      // Parse AI feedback safely
      let parsedResult;
      try {
        if (typeof result === "string") {
          const start = result.indexOf("{");
          const end = result.lastIndexOf("}");
          parsedResult = JSON.parse(result.substring(start, end + 1));
        } else {
          parsedResult = result;
        }
      } catch (err) {
        console.error("Parse error:", err);
        parsedResult = {
          score: 0,
          breakdown: { grammar: 0, vocabulary: 0, cohesion: 0, content: 0 },
          feedback: "Invalid AI response",
        };
      }

      setFeedback(parsedResult.feedback);
      setScore(parsedResult.score);
      setBreakdown(parsedResult.breakdown);
    } catch (err) {
      console.error("Submit writing error:", err);
      Alert.alert("Error", "Failed to submit writing");
    } finally {
      setLoadingSubmit(false);
    }
  };

  useEffect(() => {
    fetchTitle();
  }, []);

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={styles.gradient}
    >
      <ScrollView style={styles.container}>
        {/* Back */}
        <TouchableOpacity
          style={{ marginBottom: 12 } as any}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon
            icon={faArrowLeft as IconProp}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>

        {/* AI-assigned Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.label}>Title:</Text>
          {loadingTitle ? (
            <ActivityIndicator color="#9d4edd" />
          ) : (
            <Text style={styles.titleText}>{title}</Text>
          )}
          <TouchableOpacity style={styles.btn} onPress={fetchTitle}>
            <LinearGradient
              colors={["#9d4edd", "#6a11cb"]}
              style={styles.btnInner}
            >
              <Text style={styles.btnText}>🔄 Random Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Writing Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Writing:</Text>
          <TextInput
            style={styles.textInput}
            multiline
            numberOfLines={6}
            placeholder="Start writing here..."
            placeholderTextColor="#aaa"
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity
            style={styles.btn}
            onPress={handleSubmit}
            disabled={loadingSubmit}
          >
            <LinearGradient
              colors={["#6a11cb", "#2575fc"]}
              style={styles.btnInner}
            >
              <Text style={styles.btnText}>
                {loadingSubmit ? "Submitting..." : "🚀 Submit"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Feedback & Score */}
        {feedback && (
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>AI Feedback:</Text>
            <Text style={styles.feedbackText}>{feedback}</Text>
            <Text style={styles.scoreText}>⭐ Score: {score}</Text>
            {breakdown && (
              <View style={styles.breakdownContainer}>
                <Text>📝 Grammar: {breakdown.grammar}</Text>
                <Text>📚 Vocabulary: {breakdown.vocabulary}</Text>
                <Text>🔗 Cohesion: {breakdown.cohesion}</Text>
                <Text>💡 Content: {breakdown.content}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: getStatusBarHeight(),
  },
  container: { flex: 1, padding: 16 },
  titleContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(157,78,221,0.5)",
  },
  titleText: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#fff" },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 4, color: "#eee" },
  textInput: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 10,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
    color: "#fff",
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  feedbackContainer: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(157,78,221,0.5)",
  },
  feedbackTitle: { fontWeight: "bold", marginBottom: 6, color: "#fff" },
  feedbackText: { marginBottom: 6, color: "#ddd" },
  scoreText: { fontWeight: "bold", marginBottom: 4, color: "#9d4edd" },
  breakdownContainer: { marginTop: 4, gap: 4, color: "#fff" },
  btn: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 8,
  },
  btnInner: {
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
