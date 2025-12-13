import { TouchableOpacity, Image, StyleSheet, ViewStyle } from "react-native";
import Lesson from "../../models/lesson";

export type Status = "locked" | "active" | "completed" | "boss";

interface DungeonDoorProps {
  lesson: Lesson;
  status: Status;
  position: ViewStyle; // top/left style
  onPress: () => void;
}

const doorImages = {
  locked: require("../../uploads/assets/door/door_locked.png"),
  active: require("../../uploads/assets/door/door_active.png"),
  completed: require("../../uploads/assets/door/door_completed.png"),
  boss: require("../../uploads/assets/door/door_boss.png"),
};

export default function DungeonDoor({ status, position, onPress }: DungeonDoorProps) {
  return (
    <TouchableOpacity
      disabled={status === "locked"}
      onPress={onPress}
      style={[styles.container, position, status === "locked" && { opacity: 0.5 } as any]}
    >
      <Image source={doorImages[status]} style={styles.door} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  door: {
    width: 70,
    height: 90,
    resizeMode: "contain",
  },
});
