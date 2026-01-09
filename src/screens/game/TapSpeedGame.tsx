import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function TapSpeedGame({ navigation }: any) {
  const [status, setStatus] = useState("idle");
  const [time, setTime] = useState(10);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (status !== "playing") return;

    if (time === 0) {
      setStatus("ended");
      return;
    }

    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [status, time]);

  const startGame = () => {
    setTime(10);
    setScore(0);
    setStatus("playing");
  };

  return (
    <View style={styles.container}>
      {status === "idle" && (
        <>
          <Text style={styles.title}>⚡ Tap Speed</Text>
          <Pressable style={styles.btn} onPress={startGame}>
            <Text style={styles.txt}>Bắt đầu</Text>
          </Pressable>
        </>
      )}

      {status === "playing" && (
        <>
          <Text style={styles.info}>⏱ {time}s</Text>
          <Text style={styles.score}>{score}</Text>
          <Pressable
            style={styles.tapZone}
            onPress={() => setScore(score + 1)}
          >
            <Text style={styles.tapText}>TAP!</Text>
          </Pressable>
        </>
      )}

      {status === "ended" && (
        <>
          <Text style={styles.title}>🎉 Kết thúc</Text>
          <Text style={styles.score}>Score: {score}</Text>
          <Pressable style={styles.btn} onPress={startGame}>
            <Text style={styles.txt}>Chơi lại</Text>
          </Pressable>
          <Pressable
            style={styles.btnOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.txt}>Về Hub</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617", alignItems: "center", justifyContent: "center" },
  title: { color: "#fff", fontSize: 26, marginBottom: 20 },
  info: { color: "#fff", fontSize: 18 },
  score: { color: "#22c55e", fontSize: 48, marginVertical: 16 },
  tapZone: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  tapText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  btn: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#16a34a",
    borderRadius: 10,
    width: 160,
    alignItems: "center",
  },
  btnOutline: {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#94a3b8",
    width: 160,
    alignItems: "center",
  },
  txt: { color: "#fff", fontSize: 16 },
});
