import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Lesson from "../../models/lesson";

interface QuestModalProps {
  visible: boolean;
  lesson?: Lesson;
  onClose: () => void;
  onStart: () => void;
}

export default function QuestModal({ visible, lesson, onClose, onStart }: QuestModalProps) {
  if (!lesson) return null;
  // console.log(lesson);
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.scroll}>
          <Text style={styles.guild}>🏰 Guild Quest</Text>

          <Text style={styles.title}>{lesson.title}</Text>
          <Text style={styles.type}>📌 Type: {lesson.type.toUpperCase()}</Text>
          <Text style={styles.desc}>{lesson.description}</Text>

          <TouchableOpacity style={styles.startBtn} onPress={onStart}>
            <Text style={styles.btnText}>⚔️ Accept Quest</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  },
});
