import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default function AimTrainer({ navigation }: any) {
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);
  const [pos, setPos] = useState({ x: 100, y: 100 });

  const randomPos = () => ({
    x: Math.random() * (width - 80),
    y: Math.random() * (height - 200),
  });

  const hit = () => {
    setScore(score + 1);
    setPos(randomPos());
  };

  return (
    <View style={styles.container}>
      {status === "idle" && (
        <>
          <Text style={styles.title}>🎯 Aim Trainer</Text>
          <Pressable style={styles.btn} onPress={() => {
            setScore(0);
            setPos(randomPos());
            setStatus("playing");
          }}>
            <Text style={styles.txt}>Start</Text>
          </Pressable>
        </>
      )}

      {status === "playing" && (
        <>
          <Text style={styles.score}>Score: {score}</Text>
          <Pressable
            style={[styles.target, { left: pos.x, top: pos.y }]}
            onPress={hit}
          />
        </>
      )}

      {status === "ended" && (
        <>
          <Text style={styles.title}>Done!</Text>
          <Pressable style={styles.btn} onPress={() => setStatus("idle")}>
            <Text style={styles.txt}>Replay</Text>
          </Pressable>
          <Pressable style={styles.btnOutline} onPress={() => navigation.goBack()}>
            <Text style={styles.txt}>Back</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  title: { color: "#fff", fontSize: 26, textAlign: "center", marginTop: 80 },
  score: { color: "#fff", fontSize: 18, margin: 16 },
  target: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ef4444",
  },
  btn: {
    marginTop: 24,
    alignSelf: "center",
    padding: 14,
    backgroundColor: "#16a34a",
    borderRadius: 10,
    width: 160,
    alignItems: "center",
  },
  btnOutline: {
    marginTop: 12,
    alignSelf: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#94a3b8",
    width: 160,
    alignItems: "center",
  },
  txt: { color: "#fff" },
});
