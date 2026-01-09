import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

const EMOJIS = ["🍎", "🍌", "🍇", "🍉", "🍒", "🥝"];

type Card = {
  id: number;
  value: string;
  opened: boolean;
  matched: boolean;
};

function shuffle(array: any[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [selected, setSelected] = useState<Card[]>([]);
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState<"playing" | "ended">("playing");

  const initGame = () => {
    const data = shuffle([...EMOJIS, ...EMOJIS]).map((v, i) => ({
      id: i,
      value: v,
      opened: false,
      matched: false,
    }));
    setCards(data);
    setSelected([]);
    setLocked(false);
    setStatus("playing");
  };

  useEffect(() => {
    initGame();
  }, []);

  const onPress = (card: Card) => {
    if (locked || card.opened || card.matched || status === "ended") return;

    const newCards = cards.map(c =>
      c.id === card.id ? { ...c, opened: true } : c
    );
    setCards(newCards);

    const newSelected = [...selected, card];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setLocked(true);
      setTimeout(() => checkMatch(newSelected), 800);
    }
  };

  const checkMatch = ([a, b]: Card[]) => {
    let newCards: Card[];

    if (a.value === b.value) {
      newCards = cards.map(c =>
        c.value === a.value ? { ...c, matched: true } : c
      );
    } else {
      newCards = cards.map(c =>
        c.opened && !c.matched ? { ...c, opened: false } : c
      );
    }

    setCards(newCards);
    setSelected([]);
    setLocked(false);

    // 🎉 Check win
    const win = newCards.every(c => c.matched);
    if (win) setStatus("ended");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 Memory Game</Text>

      <View style={styles.grid}>
        {cards.map(card => (
          <Pressable
            key={card.id}
            style={styles.card}
            onPress={() => onPress(card)}
          >
            <Text style={styles.emoji}>
              {card.opened || card.matched ? card.value : "❓"}
            </Text>
          </Pressable>
        ))}
      </View>

      {status === "ended" && (
        <View style={styles.overlay}>
          <Text style={styles.win}>🎉 Hoàn thành!</Text>
          <Pressable style={styles.btn} onPress={initGame}>
            <Text style={styles.btnText}>Chơi lại</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#111" },
  title: { color: "#fff", fontSize: 24, textAlign: "center", marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  card: {
    width: 80,
    height: 80,
    margin: 8,
    backgroundColor: "#2c3e50",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 32 },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  win: { color: "#22c55e", fontSize: 28, marginBottom: 20 },
  btn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontSize: 16 },
});
