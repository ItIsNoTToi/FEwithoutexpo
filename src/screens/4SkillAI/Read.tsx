import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Lesson from "../../models/lesson";
import { getLesson } from "../../services/api/lesson.services";
import { getStatusBarHeight } from "react-native-status-bar-height";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { width } = Dimensions.get("window");

export const Read = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  useEffect(() => {
    getLesson().then((data) => {
      setLessons(data.data);
    });
  }, []);

  const renderLesson = (item: Lesson) => {
    const isExpanded = expandedLessonId === item._id;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setExpandedLessonId(isExpanded ? null : item._id)}
        activeOpacity={0.8}
      >
        <Text style={styles.cardTitle}>{item.title}</Text>
        {isExpanded && <ReadDetail lesson={item} />}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      style={[styles.container, { paddingTop: getStatusBarHeight() }]}
    >
      <Text style={styles.header}>📚 Reading Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => renderLesson(item)}
        contentContainerStyle={{ paddingBottom: 20 } as any}
      />
    </LinearGradient>
  );
};

const ReadDetail = ({ lesson }: { lesson: Lesson }) => {
  return (
    <View style={styles.detailBox}>
      <Text style={styles.detailText}>{lesson.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.1)", 
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  detailBox: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 10,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#e0e0e0",
  },
});
