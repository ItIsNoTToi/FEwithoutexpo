/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from "react";
import { ScrollView, ImageBackground, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import DungeonDoor from "./DungeonDoor";
import QuestModal from "./QuestModal";
import Lesson from "../../models/lesson";
import { progress } from "../../models/progress";
import { setLesson } from "../../redux/slices/lesson.store";
import { getLesson } from "../../services/api/lesson.services";
import { getUser } from "../../services/api/user.services";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LessonStackParamList } from "../../navigation/AppStack";

type Props = NativeStackScreenProps<LessonStackParamList, "ListLesson">;

export default function ListLesson({ navigation }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progresses, setProgresses] = useState<progress[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      getLesson().then(res => setLessons(res.data));
      getUser().then(u => console.log(u.data));
    }, [])
  );

  const getStatus = (lessonId: string, index: number) => {
    const pg = progresses.find(p =>
      typeof p.lesson === "string"
        ? p.lesson === lessonId
        : p.lesson._id === lessonId
    );
    if(index === 0) return "active";
    if (!pg || !pg.isUnlocked) return "locked";
    if (pg.status === "completed") return index === lessons.length - 1 ? "boss" : "completed";
    return "active";
  };

  const startLesson = () => {
    if (!selectedLesson) return;
    dispatch(setLesson(selectedLesson));
    setShowModal(false);
    navigation.navigate(
      selectedLesson.type === "listening" ? "ListenChat" : "ReadChat",
      { type: selectedLesson.type, resetCache: false }
    );
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ImageBackground
          source={require("../../uploads/assets/map/dungeon-map.png")}
          style={styles.map}
        >
          {lessons.map((lesson, index) => (
            <DungeonDoor
              key={lesson._id}
              lesson={lesson}
              status={getStatus(lesson._id, index)}
              position={{
                top: 140 + index * 120,
                left: index % 2 === 0 ? 80 : 220,
              }}
              onPress={() => {
                setSelectedLesson(lesson);
                setShowModal(true);
              }}
            />
          ))}
        </ImageBackground>
      </ScrollView>

      <QuestModal
        visible={showModal}
        lesson={selectedLesson || undefined}
        onClose={() => setShowModal(false)}
        onStart={startLesson}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  map: { flex: 1, width: "100%", minHeight: 800 } // minHeight đảm bảo scroll
});