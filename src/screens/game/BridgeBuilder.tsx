/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const PLATFORM_WIDTH = 60;
const BASE_GAP = 100;
const MAX_ADDITIONAL_GAP = 120;

export default function BridgeBuilder({ navigation }: any) {
  const [status, setStatus] = useState<"idle" | "playing" | "ended">("idle");
  const [bridge, setBridge] = useState(0);
  const [gap, setGap] = useState(BASE_GAP);
  const [score, setScore] = useState(0);
  const [growing, setGrowing] = useState(false);
  const [bridgeFalling, setBridgeFalling] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!growing) return;

    const i = setInterval(() => {
      setBridge(b => b + 5);
    }, 16);

    return () => clearInterval(i);
  }, [growing]);

  // Animation khi cầu rơi
  useEffect(() => {
    if (!bridgeFalling) return;

    const i = setInterval(() => {
      setRotation(r => {
        if (r >= 90) {
          clearInterval(i);
          setTimeout(() => setStatus("ended"), 300);
          return 90;
        }
        return r + 3;
      });
    }, 16);

    return () => clearInterval(i);
  }, [bridgeFalling]);

  const startGrow = () => {
    if (status !== "playing") return;
    setGrowing(true);
  };

  const stopGrow = () => {
    if (status !== "playing" || !growing) return;
    setGrowing(false);
    
    // Delay nhỏ để animation mượt hơn
    setTimeout(() => {
      checkResult();
    }, 50);
  };

  const checkResult = () => {
    const targetStart = gap;
    const targetEnd = gap + PLATFORM_WIDTH;
    
    if (bridge >= targetStart && bridge <= targetEnd) {
      // Thành công
      setScore(s => s + 1);
      
      // Animation chuyển sang platform mới
      setTimeout(() => {
        setBridge(0);
        setRotation(0);
        setGap(BASE_GAP + Math.random() * MAX_ADDITIONAL_GAP);
      }, 300);
    } else {
      // Thất bại - cho cầu rơi xuống
      setBridgeFalling(true);
    }
  };

  const startGame = () => {
    setBridge(0);
    setGap(BASE_GAP + Math.random() * 40);
    setScore(0);
    setRotation(0);
    setBridgeFalling(false);
    setStatus("playing");
  };

  const bridgeRotation = bridgeFalling ? rotation : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌉 Bridge Builder</Text>

      {status === "playing" && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>🏆 Điểm: {score}</Text>
        </View>
      )}

      <View style={styles.gameArea}>
        {/* Left platform */}
        <View style={[styles.platform, { left: 40 } as any]}>
          <View style={styles.platformTop} />
        </View>

        {/* Bridge */}
        {status === "playing" && bridge > 0 && (
            <View
                style={[
                styles.bridgeContainer,
                {
                    left: 40 + PLATFORM_WIDTH,
                    bottom: 96,
                } as any,
                ]}
            >
            <View
                style={[
                    styles.bridge,
                    {
                    height: bridge,
                    transform: [{ rotate: `${bridgeRotation}deg` }],
                    },
                ]}
            />
          </View>
        )}

        {/* Right platform */}
        <View
          style={[
            styles.platform,
            { left: 40 + PLATFORM_WIDTH + gap },
          ]}
        >
          <View style={styles.platformTop} />
        </View>

        {/* Visual helper - target zone indicator */}
        {status === "playing" && !bridgeFalling && (
          <View
            style={[
              styles.targetZone,
              {
                left: 40 + PLATFORM_WIDTH + gap,
                width: PLATFORM_WIDTH,
              },
            ]}
          />
        )}
      </View>

      {status === "idle" && (
        <View style={styles.menuContainer}>
          <Text style={styles.instructions}>
            📖 Giữ nút để xây cầu{"\n"}
            🎯 Thả ra khi đủ độ dài
          </Text>
          <Pressable style={styles.btn} onPress={startGame}>
            <Text style={styles.btnText}>🚀 Bắt đầu</Text>
          </Pressable>
        </View>
      )}

      {status === "playing" && !bridgeFalling && (
        <Pressable
          style={[styles.holdBtn, growing && styles.holdBtnActive]}
          onPressIn={startGrow}
          onPressOut={stopGrow}
        >
          <Text style={styles.holdBtnText}>
            {growing ? "⬆️ ĐANG XÂY..." : "👆 GIỮ ĐỂ XÂY"}
          </Text>
        </Pressable>
      )}

      {status === "ended" && (
        <View style={styles.menuContainer}>
          <Text style={styles.gameOver}>💥 Game Over!</Text>
          <Text style={styles.finalScore}>Điểm của bạn: {score}</Text>
          <Pressable style={styles.btn} onPress={startGame}>
            <Text style={styles.btnText}>🔄 Chơi lại</Text>
          </Pressable>
          <Pressable
            style={styles.btnOutline}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnOutlineText}>🏠 Về Hub</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  scoreContainer: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  scoreText: {
    color: "#fbbf24",
    fontSize: 20,
    fontWeight: "bold",
  },
  gameArea: {
    flex: 1,
    width: "100%",
    position: "relative",
    marginBottom: 20,
  },
  platform: {
    position: "absolute",
    bottom: 80,
    width: PLATFORM_WIDTH,
    height: 20,
    backgroundColor: "#16a34a",
    borderRadius: 6,
    borderBottomWidth: 3,
    borderBottomColor: "#166534",
  },
  platformTop: {
    position: "absolute",
    top: -4,
    left: -2,
    right: -2,
    height: 6,
    backgroundColor: "#22c55e",
    borderRadius: 3,
  },
    bridgeContainer: {
        position: "absolute",
        width: 8,
        bottom: 96,               // chân cầu
        left: 40 + PLATFORM_WIDTH,
        alignItems: "center",
    },
    bridge: {
        width: 8,
        backgroundColor: "#f59e0b",
        borderRadius: 4,
        borderRightWidth: 2,
        borderRightColor: "#d97706",
        position: "absolute",
        bottom: 0,               // 👈 QUAN TRỌNG
    },
  targetZone: {
    position: "absolute",
    bottom: 100,
    height: 2,
    backgroundColor: "#3b82f6",
    opacity: 0.5,
  },
  menuContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  instructions: {
    color: "#94a3b8",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  holdBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 50,
    minWidth: 200,
    alignItems: "center",
    marginBottom: 40,
    borderWidth: 3,
    borderColor: "#1e40af",
    elevation: 5,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  holdBtnActive: {
    backgroundColor: "#1d4ed8",
    transform: [{ scale: 0.95 }],
  },
  holdBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#15803d",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: "#64748b",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  btnOutlineText: {
    color: "#cbd5e1",
    fontSize: 18,
    fontWeight: "bold",
  },
  gameOver: {
    color: "#ef4444",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  finalScore: {
    color: "#fbbf24",
    fontSize: 24,
    marginBottom: 30,
    fontWeight: "bold",
  },
});