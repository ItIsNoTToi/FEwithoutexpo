/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";

export default function BreathingGame() {
  const scale = useRef(new Animated.Value(1)).current;
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("Tap để bắt đầu");

  useEffect(() => {
    if (!running) return;

    const loop = () => {
      setPhase("Hít vào");
      Animated.timing(scale, {
        toValue: 1.4,
        duration: 4000,
        useNativeDriver: true,
      }).start(() => {
        setPhase("Giữ");
        setTimeout(() => {
          setPhase("Thở ra");
          Animated.timing(scale, {
            toValue: 1,
            duration: 6000,
            useNativeDriver: true,
          }).start(loop);
        }, 2000);
      });
    };

    loop();
  }, [running]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧘 Breathing</Text>

      <Animated.View style={[styles.circle, { transform: [{ scale }] }]} />

      <Text style={styles.phase}>{phase}</Text>

      <Pressable
        style={styles.button}
        onPress={() => setRunning(!running)}
      >
        <Text style={styles.btnText}>
          {running ? "Dừng lại" : "Bắt đầu"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b132b",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 24, marginBottom: 24 },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#5bc0be",
    marginBottom: 24,
  },
  phase: { color: "#fff", fontSize: 20, marginBottom: 24 },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#1c2541",
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontSize: 16 },
});
