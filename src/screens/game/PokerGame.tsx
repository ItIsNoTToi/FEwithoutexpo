/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView, Animated, Alert } from "react-native";

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank = "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";
type Card = { suit: Suit; rank: Rank };

const SUITS: Suit[] = ["♠", "♥", "♦", "♣"];
const RANKS: Rank[] = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

const HAND_RANKINGS = [
  "High Card", "Pair", "Two Pair", "Three of a Kind",
  "Straight", "Flush", "Full House", "Four of a Kind",
  "Straight Flush", "Royal Flush"
];

export default function PokerGame({ navigation }: any) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [status, setStatus] = useState<"idle" | "deal" | "draw" | "result">("idle");
  const [playerScore, setPlayerScore] = useState(1000);
  const [bet, setBet] = useState(50);
  const [result, setResult] = useState("");
  const [playerHandRank, setPlayerHandRank] = useState("");
  const [dealerHandRank, setDealerHandRank] = useState("");
  const [showDealer, setShowDealer] = useState(false);

  const createDeck = (): Card[] => {
    const newDeck: Card[] = [];
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        newDeck.push({ suit, rank });
      }
    }
    return shuffleDeck(newDeck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const rankValue = (rank: Rank): number => {
    const values: { [key in Rank]: number } = {
      "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
      "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
    };
    return values[rank];
  };

  const evaluateHand = (hand: Card[]): { rank: number; name: string; score: number } => {
    const ranks = hand.map(c => rankValue(c.rank)).sort((a, b) => b - a);
    const suits = hand.map(c => c.suit);
    
    const rankCounts: { [key: number]: number } = {};
    ranks.forEach(r => rankCounts[r] = (rankCounts[r] || 0) + 1);
    
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
    const uniqueRanks = Object.keys(rankCounts).map(Number).sort((a, b) => b - a);
    
    const isFlush = suits.every(s => s === suits[0]);
    const isStraight = ranks.length === 5 && ranks[0] - ranks[4] === 4;
    const isRoyalStraight = JSON.stringify(ranks) === JSON.stringify([14, 13, 12, 11, 10]);
    
    let handRank = 0;
    let handName = "High Card";
    
    if (isFlush && isRoyalStraight) {
      handRank = 9;
      handName = "Royal Flush";
    } else if (isFlush && isStraight) {
      handRank = 8;
      handName = "Straight Flush";
    } else if (counts[0] === 4) {
      handRank = 7;
      handName = "Four of a Kind";
    } else if (counts[0] === 3 && counts[1] === 2) {
      handRank = 6;
      handName = "Full House";
    } else if (isFlush) {
      handRank = 5;
      handName = "Flush";
    } else if (isStraight) {
      handRank = 4;
      handName = "Straight";
    } else if (counts[0] === 3) {
      handRank = 3;
      handName = "Three of a Kind";
    } else if (counts[0] === 2 && counts[1] === 2) {
      handRank = 2;
      handName = "Two Pair";
    } else if (counts[0] === 2) {
      handRank = 1;
      handName = "Pair";
    }
    
    const score = handRank * 1000000 + uniqueRanks.reduce((sum, r, i) => sum + r * Math.pow(100, 4 - i), 0);
    
    return { rank: handRank, name: handName, score };
  };

  const dealCards = () => {
    if (playerScore < bet) {
      Alert.alert("Không đủ tiền để đặt cược!");
      return;
    }

    const newDeck = createDeck();
    const pHand = newDeck.slice(0, 5);
    const dHand = newDeck.slice(5, 10);
    
    setDeck(newDeck.slice(10));
    setPlayerHand(pHand);
    setDealerHand(dHand);
    setSelectedCards([]);
    setStatus("deal");
    setShowDealer(false);
    setPlayerScore(playerScore - bet);
    setResult("");
    setPlayerHandRank("");
    setDealerHandRank("");
  };

  const drawCards = () => {
    if (status !== "deal") return;

    let newDeck = [...deck];
    let newPlayerHand = [...playerHand];

    selectedCards.sort((a, b) => b - a).forEach(index => {
      if (newDeck.length > 0) {
        newPlayerHand[index] = newDeck.shift()!;
      }
    });

    setPlayerHand(newPlayerHand);
    setDeck(newDeck);
    setSelectedCards([]);
    setStatus("draw");
    
    setTimeout(() => showResult(newPlayerHand), 500);
  };

  const showResult = (finalPlayerHand: Card[]) => {
    const playerEval = evaluateHand(finalPlayerHand);
    const dealerEval = evaluateHand(dealerHand);

    setPlayerHandRank(playerEval.name);
    setDealerHandRank(dealerEval.name);
    setShowDealer(true);

    let resultText = "";
    let winAmount = 0;

    if (playerEval.score > dealerEval.score) {
      const multiplier = Math.max(2, playerEval.rank);
      winAmount = bet * multiplier;
      resultText = `🎉 Thắng! +${winAmount}$`;
      setPlayerScore(prev => prev + bet + winAmount);
    } else if (playerEval.score < dealerEval.score) {
      resultText = `😢 Thua! -${bet}$`;
    } else {
      resultText = `🤝 Hòa! +${bet}$`;
      setPlayerScore(prev => prev + bet);
    }

    setResult(resultText);
    setStatus("result");
  };

  const toggleCardSelection = (index: number) => {
    if (status !== "deal") return;
    
    setSelectedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const resetGame = () => {
    setStatus("idle");
    setSelectedCards([]);
    setShowDealer(false);
  };

  const adjustBet = (amount: number) => {
    const newBet = Math.max(10, Math.min(playerScore, bet + amount));
    setBet(newBet);
  };

  const renderCard = (card: Card, hidden: boolean = false, selected: boolean = false) => {
    const isRed = card.suit === "♥" || card.suit === "♦";
    
    if (hidden) {
      return (
        <View style={[styles.card, styles.cardBack]}>
          <Text style={styles.cardBackText}>🎴</Text>
        </View>
      );
    }

    return (
      <View style={[
        styles.card,
        selected && styles.cardSelected
      ]}>
        <Text style={[styles.cardRank, isRed && styles.cardRed]}>
          {card.rank}
        </Text>
        <Text style={[styles.cardSuit, isRed && styles.cardRed]}>
          {card.suit}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🃏 Texas Poker</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>💰 Tiền:</Text>
          <Text style={styles.scoreValue}>${playerScore}</Text>
        </View>
      </View>

      {/* Dealer Hand */}
      <View style={styles.handSection}>
        <View style={styles.handHeader}>
          <Text style={styles.handTitle}>🎩 Dealer</Text>
          {dealerHandRank && showDealer && (
            <Text style={styles.handRank}>{dealerHandRank}</Text>
          )}
        </View>
        <View style={styles.cardsContainer}>
          {dealerHand.map((card, i) => (
            <View key={i} style={styles.cardWrapper}>
              {renderCard(card, !showDealer)}
            </View>
          ))}
        </View>
      </View>

      {/* Result */}
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      )}

      {/* Player Hand */}
      <View style={styles.handSection}>
        <View style={styles.handHeader}>
          <Text style={styles.handTitle}>👤 Bạn</Text>
          {playerHandRank && (
            <Text style={styles.handRank}>{playerHandRank}</Text>
          )}
        </View>
        <View style={styles.cardsContainer}>
          {playerHand.map((card, i) => (
            <Pressable
              key={i}
              style={styles.cardWrapper}
              onPress={() => toggleCardSelection(i)}
              disabled={status !== "deal"}
            >
              {renderCard(card, false, selectedCards.includes(i))}
              {status === "deal" && selectedCards.includes(i) && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓</Text>
                </View>
              )}
            </Pressable>
          ))}
        </View>
        {status === "deal" && (
          <Text style={styles.hint}>
            👆 Chọn bài để đổi ({selectedCards.length}/5)
          </Text>
        )}
      </View>

      {/* Betting Controls */}
      {status === "idle" && (
        <View style={styles.betSection}>
          <Text style={styles.betLabel}>💵 Đặt cược:</Text>
          <View style={styles.betControls}>
            <Pressable style={styles.betBtn} onPress={() => adjustBet(-10)}>
              <Text style={styles.betBtnText}>-10</Text>
            </Pressable>
            <Text style={styles.betAmount}>${bet}</Text>
            <Pressable style={styles.betBtn} onPress={() => adjustBet(10)}>
              <Text style={styles.betBtnText}>+10</Text>
            </Pressable>
          </View>
          <View style={styles.quickBets}>
            <Pressable style={styles.quickBetBtn} onPress={() => setBet(50)}>
              <Text style={styles.quickBetText}>$50</Text>
            </Pressable>
            <Pressable style={styles.quickBetBtn} onPress={() => setBet(100)}>
              <Text style={styles.quickBetText}>$100</Text>
            </Pressable>
            <Pressable style={styles.quickBetBtn} onPress={() => setBet(200)}>
              <Text style={styles.quickBetText}>$200</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {status === "idle" && (
          <Pressable style={styles.btnPrimary} onPress={dealCards}>
            <Text style={styles.btnText}>🎲 Chia Bài</Text>
          </Pressable>
        )}

        {status === "deal" && (
          <>
            <Pressable style={styles.btnPrimary} onPress={drawCards}>
              <Text style={styles.btnText}>🔄 Đổi Bài</Text>
            </Pressable>
            <Pressable style={styles.btnSecondary} onPress={() => showResult(playerHand)}>
              <Text style={styles.btnText}>✋ Giữ Nguyên</Text>
            </Pressable>
          </>
        )}

        {(status === "draw" || status === "result") && (
          <Pressable style={styles.btnPrimary} onPress={resetGame}>
            <Text style={styles.btnText}>🃏 Ván Mới</Text>
          </Pressable>
        )}

        <Pressable style={styles.btnOutline} onPress={() => navigation.goBack()}>
          <Text style={styles.btnOutlineText}>🏠 Về Hub</Text>
        </Pressable>
      </View>

      {/* Hand Rankings Guide */}
      <View style={styles.guideSection}>
        <Text style={styles.guideTitle}>📊 Bảng Xếp Hạng Bài</Text>
        <View style={styles.guideGrid}>
          {HAND_RANKINGS.map((rank, i) => (
            <View key={i} style={styles.guideItem}>
              <Text style={styles.guideRank}>{9 - i + 1}</Text>
              <Text style={styles.guideName}>{rank}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e1a",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 12,
  },
  scoreContainer: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fbbf24",
    alignItems: "center",
  },
  scoreLabel: {
    color: "#94a3b8",
    fontSize: 16,
    marginRight: 8,
  },
  scoreValue: {
    color: "#fbbf24",
    fontSize: 24,
    fontWeight: "bold",
  },
  handSection: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  handHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  handTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  handRank: {
    color: "#22c55e",
    fontSize: 14,
    fontWeight: "bold",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  cardWrapper: {
    position: "relative",
  },
  card: {
    width: 60,
    height: 85,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  cardSelected: {
    borderColor: "#3b82f6",
    borderWidth: 3,
    backgroundColor: "#eff6ff",
  },
  cardBack: {
    backgroundColor: "#dc2626",
    borderColor: "#991b1b",
    justifyContent: "center",
  },
  cardBackText: {
    fontSize: 40,
  },
  cardRank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  cardSuit: {
    fontSize: 32,
    color: "#000",
  },
  cardRed: {
    color: "#dc2626",
  },
  selectedBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#3b82f6",
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  selectedBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  hint: {
    color: "#94a3b8",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  resultContainer: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#fbbf24",
  },
  resultText: {
    color: "#fbbf24",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  betSection: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  betLabel: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  betControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  betBtn: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  betBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  betAmount: {
    color: "#fbbf24",
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 24,
    minWidth: 80,
    textAlign: "center",
  },
  quickBets: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  quickBetBtn: {
    backgroundColor: "#334155",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#475569",
  },
  quickBetText: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  btnPrimary: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#15803d",
  },
  btnSecondary: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2563eb",
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: "#64748b",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnOutlineText: {
    color: "#cbd5e1",
    fontSize: 18,
    fontWeight: "bold",
  },
  guideSection: {
    backgroundColor: "#1e293b",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  guideTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  guideGrid: {
    gap: 8,
  },
  guideItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#334155",
    padding: 10,
    borderRadius: 8,
  },
  guideRank: {
    color: "#fbbf24",
    fontSize: 16,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
  },
  guideName: {
    color: "#94a3b8",
    fontSize: 14,
    flex: 1,
  },
});