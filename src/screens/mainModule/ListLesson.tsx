/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { ScrollView, ImageBackground, StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import DungeonDoor from "./DungeonDoor";
import QuestModal from "./QuestModal";
import Lesson from "../../models/lesson";
import { setSelectLesson, setLessons } from "../../redux/slices/lesson.store";
import { setUserId } from "../../redux/slices/user.store";
import { getLesson } from "../../services/api/lesson.services";
import { getUser } from "../../services/api/user.services";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LessonStackParamList } from "../../navigation/AppStack";
import { RootState } from "../../redux/store";
import { createProgress, fetchProgressApi } from "../../services/api/progress.services";
import { setProgress, updateProgress } from "../../redux/slices/progress.store";
import { getProgressStatus } from "../../helper/checkpg";

type Props = NativeStackScreenProps<LessonStackParamList, "ListLesson">;
type StartMode = "new" | "replay" | "continue";

export default function ListLesson({ navigation }: Props) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const lessons = useSelector((state: RootState) => state.lesson.Lessons);
  const selectedlesson = useSelector((state: RootState) => state.lesson.Lesson);
  const userId = useSelector((state: RootState) => state.user._id);
  const progress = useSelector((state: RootState) => state.progress.progress);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (lessons.length > 0) return;
      const fetchData = async () => {
        try {
          if (!isActive) return;
          const res = await getLesson();
          const lessonList: Lesson[] = res.data.map((l: any) => ({
            _id: l._id,
            title: l.title,
            type: l.type,
            order: l.order,
            status: l.status,
            duration: l.duration,
            nextLesson: l.nextLesson?._id || null,
          }));
          dispatch(setLessons(lessonList));

          if(userId){
            const pg = await fetchProgressApi(userId);
            if(pg){
              // console.log(pg.data.Listlesson[0].lesson);
              dispatch(setProgress(pg.data));
            }else{
              dispatch(setProgress(null));
            }
          } else {
            return;
          }
        } catch (error) {
          console.error('Failed to fetch data', error);
          return;
        }
      };
      fetchData();
      return () => {
        isActive = false;
      };
    }, [])
  );
  const getStatus = (lesson: Lesson, index: number) => {
      if (!progress || !progress.Listlesson) return index === 0 ? "active" : "locked";
      const pg = progress.Listlesson.find(
        p => String(p.lesson) === String(lesson._id)
      );
      if (pg) {
        switch (pg.status) {
          case "passed": return "completed";
          case "in_progress": return "active";
          case "open": return "active";
          case "failed": return "locked";
          case "paused": return "paused";
          case "close": return index === 0 ? "active" : "locked"; // lesson đầu tiên mặc định active
          default: return "locked";
        }
      }
      return index === 0 ? "active" : "locked";
    };
    const startLesson = async (
    lesson: Lesson,
    mode: StartMode
    ) => {
    if (!lesson || !userId) return;

    const pg = progress?.Listlesson.find(
      p => String(p.lesson) === String(lesson._id)
    );

    if (pg) {
      dispatch(updateProgress({
        lesson,
        status: "in_progress",
        retakeCount:
          mode === "replay"
            ? (pg.retakeCount || 0) + 1
            : pg.retakeCount,
        step: 
          mode === "replay"
            ? 0
            : pg.step
      }));
    }

    dispatch(setSelectLesson(lesson));
    setShowModal(false);

    switch (lesson.type) {
      case "listening":
        navigation.navigate("listening", { type: lesson.type, lessonmode: mode });
        break;
      case "topic":
        navigation.navigate("topic", { type: lesson.type, lessonmode: mode });
        break;
      default:
        navigation.navigate("reading", { type: lesson.type, lessonmode: mode });
    }
    };

  const lessonStatus = selectedlesson
    ? getStatus(
        selectedlesson,
        lessons.findIndex(l => l._id === selectedlesson._id)
      )
    : null;
  const isCompleted = lessonStatus === "completed";
  const isPaused = lessonStatus === "paused";
  const isActive = lessonStatus === "active";
  return (
    <>
      <ScrollView contentContainerStyle={styles.viewscroll}>
        <ImageBackground
          source={require("../../uploads/assets/map/dungeon-map.png")}
          style={styles.map}
        >
          {lessons.map((lesson, index) => (
            <DungeonDoor
              key={lesson?._id}
              lesson={lesson}
              status={getStatus(lesson, index)}
              position={{
                top: 140 + index * 120,
                left: index % 2 === 0 ? 80 : 220,
              }}
              onPress={() => {
                setShowModal(true);  
                dispatch(setSelectLesson(lesson));
              }}
            />
          ))}
        </ImageBackground>
      </ScrollView>

      {/* QuestModal render ở đây */}
      <Modal transparent animationType="fade" visible={showModal}>
        <View style={styles.overlay}>
          <View style={styles.scroll}>
            <Text style={styles.guild}>🏰 Guild Quest</Text>
            <Text style={styles.title}>{selectedlesson?.title}</Text>
            <Text style={styles.type}>📌 Type: {selectedlesson?.type.toUpperCase()}</Text>
            <Text style={styles.desc}>{selectedlesson?.description}</Text>
            {(isCompleted || isPaused) && (
              <>
                <TouchableOpacity
                  style={[styles.startBtn, styles.replayBtn]}
                  onPress={() => startLesson(selectedlesson!, "replay")}
                >
                  <Text style={styles.btnText}>🔁 Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={() => startLesson(selectedlesson!, "continue")}
                >
                  <Text style={styles.btnText}>⚔️ Continue Quest</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Active (chưa học) */}
            {isActive && (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => startLesson(selectedlesson!, "new")}
              >
                <Text style={styles.btnText}>⚔️ Accept Quest</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  replayBtn: {
    backgroundColor: "#38bdf8",
  },
  completedText: {
    textAlign: "center",
    color: "#22c55e",
    fontWeight: "700",
    marginBottom: 10,
  },
  viewscroll: { flexGrow: 1 },
  map: { flex: 1, width: "100%", minHeight: 800 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    width: "85%",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 20,
  },
  guild: {
    color: "#facc15",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  type: {
    color: "#38bdf8",
    marginBottom: 10,
  },
  desc: {
    color: "#cbd5f5",
    marginBottom: 20,
  },
  startBtn: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnText: {
    color: "#000",
    fontWeight: "800",
    textAlign: "center",
  },
  close: {
    textAlign: "center",
    color: "#94a3b8",
  }, // minHeight đảm bảo scroll
});