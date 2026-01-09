/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const BLOCK_HEIGHT = 35;
const BASE_SPEED = 3;
const SPEED_INCREMENT = 0.4;

export default function BuildHouseGame({ navigation }: any) {
  const [blocks, setBlocks] = useState([
    { x: 30, width: SCREEN_WIDTH - 60 }
  ]);

  const [movingX, setMovingX] = useState(0);
  const [movingDir, setMovingDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "playing" | "ended">("idle");
  const [speed, setSpeed] = useState(BASE_SPEED);
  const [perfectCount, setPerfectCount] = useState(0);
  const [showPerfect, setShowPerfect] = useState(false);

  const perfectAnim = useRef(new Animated.Value(0)).current;
  const blockShake = useRef(new Animated.Value(0)).current;

  const currentWidth = blocks[blocks.length - 1].width;
  const floor = blocks.length - 1;

  // Move block with increasing speed - FIXED LOGIC
  useEffect(() => {
    if (status !== "playing") return;

    const timer = setInterval(() => {
      setMovingX(prevX => {
        const newX = prevX + movingDir * speed;
        
        // Bounce at boundaries
        if (newX <= 0) {
          setMovingDir(1);
          return 0;
        }
        if (newX + currentWidth >= SCREEN_WIDTH) {
          setMovingDir(-1);
          return SCREEN_WIDTH - currentWidth;
        }
        
        return newX;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [status, movingDir, currentWidth, speed]);

  // Perfect animation
  useEffect(() => {
    if (!showPerfect) return;

    Animated.sequence([
      Animated.timing(perfectAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(perfectAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setShowPerfect(false));
  }, [showPerfect]);

  const drop = () => {
    if (status !== "playing") return;

    const last = blocks[blocks.length - 1];
    const left = Math.max(last.x, movingX);
    const right = Math.min(last.x + last.width, movingX + currentWidth);
    const overlap = right - left;

    // Check if game over
    if (overlap <= 15) {
      // Shake animation before game over
      Animated.sequence([
        Animated.timing(blockShake, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(blockShake, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(blockShake, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setStatus("ended");
      });
      return;
    }

    // Check for perfect placement
    const tolerance = 8;
    const centerDiff = Math.abs((movingX + currentWidth / 2) - (last.x + last.width / 2));
    const isPerfect = centerDiff <= tolerance;

    if (isPerfect) {
      setPerfectCount(c => c + 1);
      setShowPerfect(true);
      setBlocks([...blocks, { x: last.x, width: last.width }]);
    } else {
      setPerfectCount(0);
      setBlocks([...blocks, { x: left, width: overlap }]);
    }

    // Increase speed every 3 floors
    if ((blocks.length + 1) % 3 === 0) {
      setSpeed(s => Math.min(s + SPEED_INCREMENT, 10));
    }

    // Reset moving block position
    setMovingX(left);
    setMovingDir(1);
  };

  const start = () => {
    setBlocks([{ x: 30, width: SCREEN_WIDTH - 60 }]);
    setMovingX(30);
    setMovingDir(1);
    setSpeed(BASE_SPEED);
    setPerfectCount(0);
    setShowPerfect(false);
    blockShake.setValue(0);
    perfectAnim.setValue(0);
    setStatus("playing");
  };

  const getBlockColor = (index: number) => {
    const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
    return colors[index % colors.length];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏗️ Xây Nhà Chọc Trời</Text>

      {status === "playing" && (
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>🏢 Tầng</Text>
            <Text style={styles.statValue}>{floor}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>⚡ Tốc độ</Text>
            <Text style={styles.statValue}>{speed.toFixed(1)}x</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>🎯 Perfect</Text>
            <Text style={styles.statValue}>{perfectCount}</Text>
          </View>
        </View>
      )}

      <View style={styles.gameAreaWrapper}>
        <Animated.View style={[
          styles.gameArea,
          { transform: [{ translateX: blockShake }] }
        ]}>
          {/* Base/Foundation */}
          <View style={styles.foundation} />

          {/* Placed blocks */}
          {blocks.map((b, i) => (
            <View
              key={`block-${i}`}
              style={[
                styles.block,
                {
                  width: b.width,
                  left: b.x,
                  bottom: i * BLOCK_HEIGHT,
                  backgroundColor: i === 0 ? "#15803d" : getBlockColor(i),
                  borderTopWidth: 2,
                  borderTopColor: i === 0 ? "#16a34a" : "rgba(255,255,255,0.3)",
                } as any,
              ]} 
            >
              {i > 0 && (
                <View style={styles.window}>
                  <View style={styles.windowPane} />
                  <View style={styles.windowPane} />
                </View>
              )}
            </View>
          ))}

          {/* Moving block */}
          {status === "playing" && (
            <View
              style={[
                styles.block,
                styles.movingBlock,
                {
                  width: currentWidth,
                  left: movingX,
                  bottom: blocks.length * BLOCK_HEIGHT,
                  backgroundColor: getBlockColor(blocks.length),
                },
              ]}
            >
              <View style={styles.window}>
                <View style={styles.windowPane} />
                <View style={styles.windowPane} />
              </View>
            </View>
          )}

          {/* Perfect indicator */}
          {showPerfect && (
            <Animated.View
              style={[
                styles.perfectIndicator,
                {
                  bottom: blocks.length * BLOCK_HEIGHT + 40,
                  opacity: perfectAnim,
                  transform: [
                    {
                      scale: perfectAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.5, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.perfectText}>🎯 PERFECT!</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>

      {status === "idle" && (
        <View style={styles.menuContainer}>
          <Text style={styles.instructions}>
            📖 Nhấn nút để đặt khối{"\n"}
            🎯 Đặt chính giữa để được "Perfect"{"\n"}
            ⚡ Tốc độ tăng dần theo tầng
          </Text>
          <Pressable style={styles.btn} onPress={start}>
            <Text style={styles.btnText}>🚀 Bắt Đầu Xây</Text>
          </Pressable>
        </View>
      )}

      {status === "playing" && (
        <Pressable style={styles.dropBtn} onPress={drop}>
          <Text style={styles.dropBtnText}>⬇️ ĐẶT KHỐI</Text>
        </Pressable>
      )}

      {status === "ended" && (
        <View style={styles.menuContainer}>
          <Text style={styles.gameOver}>🏆 Hoàn Thành!</Text>
          <Text style={styles.result}>
            Tòa nhà cao {floor} tầng
          </Text>
          {perfectCount > 0 && (
            <Text style={styles.perfectScore}>
              ✨ {perfectCount} Perfect streak!
            </Text>
          )}
          <Pressable style={styles.btn} onPress={start}>
            <Text style={styles.btnText}>🔄 Xây Lại</Text>
          </Pressable>
          <Pressable style={styles.btnOutline} onPress={() => navigation.goBack()}>
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
    backgroundColor: "#0a0e1a",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  statBox: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  gameAreaWrapper: {
    flex: 1,
    width: "100%",
  },
  gameArea: {
    flex: 1,
    width: "100%",
    position: "relative",
  },
  foundation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#374151",
    borderTopWidth: 2,
    borderTopColor: "#4b5563",
  },
  block: {
    position: "absolute",
    height: BLOCK_HEIGHT - 3,
    borderRadius: 4,
    borderBottomWidth: 3,
    borderBottomColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  movingBlock: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  window: {
    flexDirection: "row",
    gap: 4,
    justifyContent: "center",
  },
  windowPane: {
    width: 8,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 2,
  },
  perfectIndicator: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  perfectText: {
    color: "#fbbf24",
    fontSize: 24,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  menuContainer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  instructions: {
    color: "#94a3b8",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  dropBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 50,
    marginBottom: 40,
    borderWidth: 3,
    borderColor: "#1e40af",
    minWidth: 200,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  dropBtnText: {
    color: "#fff",
    fontSize: 20,
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
    color: "#22c55e",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  result: {
    color: "#fbbf24",
    fontSize: 22,
    marginBottom: 8,
    fontWeight: "bold",
  },
  perfectScore: {
    color: "#fbbf24",
    fontSize: 18,
    marginBottom: 20,
  },
});