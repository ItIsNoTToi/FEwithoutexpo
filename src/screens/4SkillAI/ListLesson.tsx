import { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getLesson } from "../../services/api/lesson.services";
import Lesson from "../../models/lesson";
import User from '../../models/user';
import { useDispatch } from "react-redux";
import { setLesson } from "../../redux/slices/lesson.store";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { progress } from "../../models/progress";
import {fetchProgressApi} from "../../services/api/progress.services";
import { getUser } from "../../services/api/user.services";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LessonStackParamList } from '../../navigation/AppStack';
import { retakeLessonApi } from "../../services/api/AI.services";

type Props = NativeStackScreenProps<LessonStackParamList, 'ListLesson'>;

export default function ListLesson({ navigation }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [user, setUser] = useState<User>();
  const [progresses, setProgresses] = useState<progress[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    getUser()
      .then(data => setUser(data.data))
      .catch(error => console.error(error));
  }, []);

  // Khi user đã có, mới fetch progress
  useFocusEffect(
    useCallback(() => {
      getLesson()
      .then((data) => setLessons(data.data))
      .catch((error) => console.error(error));
      if (user?._id) {
        fetchProgressApi(user._id)
          .then((data) => setProgresses(data.data))
          .catch((error) => console.error(error));
      }
    }, [user])
  );

  const isLessonDisabled = (lessonId: string) => {
    const pg = progresses.find(
      (p) =>
        (typeof p.lesson === "string" && p.lesson === lessonId) ||
        (typeof p.lesson === "object" && "_id" in p.lesson && p.lesson._id === lessonId)
    );
    return !(pg && pg.isUnlocked); // chỉ cần dựa vào isUnlocked
  };

  const handleRetake = (lesson: Lesson) => {
    Alert.alert(
      "Học lại",
      "Bạn có chắc muốn học lại từ đầu?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          onPress: async () => {
            try {
              // Gọi API reset progress
              await retakeLessonApi(user?._id, lesson._id);
              // Cập nhật lại progress local
              fetchProgressApi(user?._id).then((data) => setProgresses(data.data));
              // Chuyển vào bài học
              goToLesson(lesson, lesson.type, true);
            } catch (err) {
              console.error(err);
            }
          },
        },
      ]
    );
  };

  const goToLesson = (lesson: Lesson, type: string, resetCache: boolean) => {
    dispatch(setLesson(lesson));
    navigation.navigate(
      type === "listening" ? "ListenChat" :
                            "ReadChat",
      { type, resetCache: resetCache }
    );
  };

  const renderLesson = ({ item }: { item: Lesson}) => {
    const userProgress = progresses.find(
      (p) =>
        (typeof p.lesson === "string" && p.lesson === item._id) ||
        (typeof p.lesson === "object" && "_id" in p.lesson && p.lesson._id === item._id)
    ); 

    return (
      <TouchableOpacity
        style={[styles.card, isLessonDisabled(item._id) && { opacity: 0.5 }] as any}
        disabled={isLessonDisabled(item._id)} 
        activeOpacity={0.7}
        onPress={() => goToLesson(item, item.type, false)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.icon}>📘</Text>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {item.description} - {item.type}
        </Text>
        {/* Hiển thị trạng thái bài học */}
        {userProgress && (
          <Text style={{ marginTop: 6, fontSize: 14, color: "#0f172a" } as any}>
            {userProgress.status === "completed"
              ? "✅ Hoàn thành"
              : userProgress.status === "in_progress"
              ? `⏳ Đang học (${userProgress.progress || 0}%)`
              : userProgress.status === "paused"
              ? "⏸️ Tạm dừng"
              : "📖 Chưa học"}
          </Text>
        )} 

        {userProgress?.status === "completed" ? (
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#3b82f6" }] as any}
              onPress={() => goToLesson(item, item.type, false)} // Review
            >
              <Text style={styles.btnText}>👀 Review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#f97316" }] as any}
              onPress={() => handleRetake(item)} // Retake
            >
              <Text style={styles.btnText}>🔄 Retake</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#10b981" }] as any}
              onPress={() => goToLesson(item, item.type, false)}
            >
              <Text style={styles.btnText}>▶️ Start</Text>
            </TouchableOpacity>
          </View>
          
        )}
      </TouchableOpacity>
    );
  }

  // if(lessons){
  //   console.log(lessons);
  // }

  // if(progresses){
  //   console.log(progresses);
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📖 Lessons</Text>
      <FlatList
        data={lessons}
        keyExtractor={(item) => item._id}
        renderItem={renderLesson}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    paddingTop: getStatusBarHeight(),
    padding: 10,
    paddingBottom: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
    color: "#1e293b",
  },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  icon: { fontSize: 20, marginRight: 8 },
  title: { fontSize: 18, fontWeight: "600", color: "#334155", flexShrink: 1 },
  description: { fontSize: 15, color: "#64748b", lineHeight: 20 },
  btnRow: { flexDirection: "row", marginTop: 10, justifyContent: "space-between" },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
