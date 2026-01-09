import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const GAMES = [
  {
    id: "memory",
    title: "🧠 Memory",
    desc: "Lật thẻ ghi nhớ",
    screen: "Memory",
    enabled: true,
  },
  {
    id: "breathing",
    title: "🧘 Breathing",
    desc: "Thư giãn, giảm stress",
    screen: "Breathing",
    enabled: true,
  },
  {
    id: "tap",
    title: "⚡ Tap Speed",
    desc: "Tap nhanh trong 10s",
    screen: "TapSpeed",
    enabled: true,
  },
  {
    id: "aim",
    title: "🎯 Aim Trainer",
    desc: "Luyện phản xạ",
    screen: "Aim",
    enabled: true,
  },
  {
    id: "build",
    title: "🏗️ Build House",
    desc: "Xếp tầng xây nhà",
    screen: "BuildHouse",
    enabled: true,
  },
  {
    id: "bridge",
    title: "🚧 Bridge Builder",
    desc: "Xây cầu qua trụ",
    screen: "Bridge",
    enabled: true,
  },
  {
    id: "poker",
    title: "🃏 Poker",
    desc: "Card poker",
    screen: "Poker",
    enabled: true,
  },
  {
    id: "FruitCatcher",
    title: "🍎🍏🥧 FruitCatcher",
    desc: "Hứng Trái Cây",
    screen: "FruitCatcher",
    enabled: true,
  },
];

export default function GameHub({ navigation }: any) {
  const playableGames = GAMES.filter(g => g.enabled);

  const playRandom = () => {
    const game =
      playableGames[Math.floor(Math.random() * playableGames.length)];
    navigation.navigate(game.screen);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎮 Mini Games</Text>

      <Pressable style={styles.randomBtn} onPress={playRandom}>
        <Text style={styles.randomText}>🎲 Chơi ngẫu nhiên</Text>
      </Pressable>

      {GAMES.map(game => (
        <Pressable
          key={game.id}
          style={[styles.card, !game.enabled && styles.disabled]}
          onPress={() => game.enabled && navigation.navigate(game.screen)}
        >
          <Text style={styles.cardTitle}>{game.title}</Text>
          <Text style={styles.cardDesc}>{game.desc}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    padding: 16,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  randomBtn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  randomText: { color: "#fff", fontSize: 16 },
  card: {
    backgroundColor: "#1e293b",
    padding: 15,
    borderRadius: 16,
    marginBottom: 25,
  },
  disabled: { opacity: 0.4 },
  cardTitle: {
    color: "#fff",
    fontSize: 20,
  },
  cardDesc: {
    color: "#cbd5e1",
    fontSize: 14,
    marginTop: 4,
  },
});
