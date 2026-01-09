/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, StyleSheet, Dimensions, Animated, 
  PanResponder, StatusBar, Pressable 
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BASKET_SIZE = 80;
const ITEM_SIZE = 40;
const ITEMS = ["🍎", "🍊", "🍋", "🍇", "🍉", "🍓", "🫐"];
const BOMB = "💣";

export default function FruitCatcher() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"start" | "playing" | "over">("start");
  
  // Vị trí giỏ hàng (Basket)
  const basketX = useRef(new Animated.Value(SCREEN_WIDTH / 2 - BASKET_SIZE / 2)).current;
  
  // Danh sách các vật phẩm đang rơi
  const [fallingItems, setFallingItems] = useState<any[]>([]);
  const gameLoop = useRef<any>(null);

  // Xử lý kéo giỏ hàng
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.moveX - BASKET_SIZE / 2;
        if (newX < 0) newX = 0;
        if (newX > SCREEN_WIDTH - BASKET_SIZE) newX = SCREEN_WIDTH - BASKET_SIZE;
        basketX.setValue(newX);
      },
    })
  ).current;

  const startGame = () => {
    setScore(0);
    setLives(3);
    setFallingItems([]);
    setGameState("playing");
  };

  // Tạo vật phẩm mới ngẫu nhiên
  const spawnItem = () => {
    const id = Math.random().toString();
    const isBomb = Math.random() < 0.2; // 20% là bom
    const startX = Math.random() * (SCREEN_WIDTH - ITEM_SIZE);
    const fallAnim = new Animated.Value(-ITEM_SIZE);

    const newItem = {
      id,
      type: isBomb ? BOMB : ITEMS[Math.floor(Math.random() * ITEMS.length)],
      x: startX,
      y: fallAnim,
      isBomb
    };

    setFallingItems(prev => [...prev, newItem]);

    // Hiệu ứng rơi
    Animated.timing(fallAnim, {
      toValue: SCREEN_HEIGHT,
      duration: Math.max(1500, 3000 - score * 50), // Càng nhiều điểm rơi càng nhanh
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        // Nếu là trái cây mà rơi mất thì mất mạng
        if (!isBomb) setLives(l => Math.max(0, l - 1));
        removeItem(id);
      }
    });
  };

  const removeItem = (id: string) => {
    setFallingItems(prev => prev.filter(item => item.id !== id));
  };

  // Vòng lặp kiểm tra va chạm (Collision Detection)
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      if (Math.random() < 0.05) spawnItem(); // Tần suất xuất hiện

      fallingItems.forEach(item => {
        const itemY = (item.y as any)._value;
        const bX = (basketX as any)._value;

        // Kiểm tra nếu item chạm vào giỏ
        if (itemY > SCREEN_HEIGHT - 160 && itemY < SCREEN_HEIGHT - 100) {
          if (item.x > bX - 20 && item.x < bX + BASKET_SIZE) {
            if (item.isBomb) {
              setLives(0); // Chạm bom là thua luôn
            } else {
              setScore(s => s + 1);
              removeItem(item.id);
            }
          }
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameState, fallingItems]);

  // Kiểm tra Game Over
  useEffect(() => {
    if (lives === 0) setGameState("over");
  }, [lives]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header: Score & Lives */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <View style={{alignItems: 'flex-end'} as any}>
          <Text style={styles.label}>LIVES</Text>
          <Text style={styles.livesValue}>{"❤️".repeat(lives)}</Text>
        </View>
      </View>

      {/* Play Area */}
      <View style={styles.playArea}>
        {fallingItems.map(item => (
          <Animated.Text
            key={item.id}
            style={[styles.item, { left: item.x, top: item.y }]}
          >
            {item.type}
          </Animated.Text>
        ))}

        {/* Basket */}
        <Animated.View 
          {...panResponder.panHandlers}
          style={[styles.basket, { transform: [{ translateX: basketX }] }]}
        >
          <View style={styles.basketTop} />
          <Text style={{fontSize: 40} as any}>🧺</Text>
        </Animated.View>
      </View>

      {/* Overlays */}
      {gameState === "start" && (
        <View style={styles.overlay}>
          <Text style={styles.title}>FRUIT CATCHER</Text>
          <Pressable style={styles.btn} onPress={startGame}>
            <Text style={styles.btnText}>CHƠI NGAY</Text>
          </Pressable>
        </View>
      )}

      {gameState === "over" && (
        <View style={[styles.overlay, {backgroundColor: 'rgba(0,0,0,0.85)'} as any]}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
          <Text style={styles.finalScore}>Số trái cây: {score}</Text>
          <Pressable style={[styles.btn, {backgroundColor: '#ef4444'} as any]} onPress={startGame}>
            <Text style={styles.btnText}>THỬ LẠI</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 30, 
    paddingTop: 60,
    zIndex: 10
  },
  label: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold', letterSpacing: 2 },
  scoreValue: { color: '#fff', fontSize: 40, fontWeight: '900' },
  livesValue: { fontSize: 20, marginTop: 5 },
  playArea: { flex: 1, position: 'relative' },
  item: { position: 'absolute', fontSize: ITEM_SIZE },
  basket: {
    position: 'absolute',
    bottom: 40,
    width: BASKET_SIZE,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  basketTop: {
    position: 'absolute',
    top: 10,
    width: 60,
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  title: { color: '#fbbf24', fontSize: 40, fontWeight: '900', marginBottom: 40 },
  gameOverText: { color: '#ef4444', fontSize: 50, fontWeight: '900', marginBottom: 10 },
  finalScore: { color: '#fff', fontSize: 24, marginBottom: 40 },
  btn: {
    backgroundColor: "#22c55e",
    paddingVertical: 18,
    paddingHorizontal: 50,
    borderRadius: 40,
    shadowColor: "#22c55e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  btnText: { color: "white", fontSize: 20, fontWeight: "bold" },
});