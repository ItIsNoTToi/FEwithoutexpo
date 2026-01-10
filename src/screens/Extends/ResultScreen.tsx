import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getHistoryQuiz } from "../../services/api/quiz.services";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function QuizHistoryScreen({ navigation }: any) {
  const userId = useSelector((state: RootState) => state.user._id);
  const [histories, setHistories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    if (!userId) return;

    getHistoryQuiz(userId)
      .then(res => {
        if (res.success) {
          // sort cũ → mới
          const sorted = res.data.sort(
            (a: any, b: any) =>
              new Date(a.answeredAt).getTime() -
              new Date(b.answeredAt).getTime()
          );
          setHistories(sorted);
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  /* ================= CHỈ LẤY 8 LẦN GẦN NHẤT ================= */
  const recentHistories = useMemo(() => {
    return histories.slice(-8);
  }, [histories]);

  /* ================= BAR CHART DATA ================= */
  const chartData = useMemo(() => {
    return {
      labels: recentHistories.map((_, i) => `#${i + 1}`),
      datasets: [
        {
          data: recentHistories.map(h => Math.min(h.percent, 100)),
        },
      ],
    };
  }, [recentHistories]);

  /* ================= LOADING / EMPTY ================= */
  if (loading) {
    return <Text style={styles.loading}>Loading quiz history...</Text>;
  }

  if (histories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Chưa có lịch sử làm quiz 📭</Text>
      </View>
    );
  }

  /* ================= UI ================= */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Quiz History</Text>

      {/* ===== BAR CHART ===== */}
      <View style={styles.chartBox}>
        <Text style={styles.chartTitle}>Điểm các lần làm quiz (%)</Text>
        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={240}
          fromZero
          showValuesOnTopOfBars
          yAxisLabel=""          // 🔥 BẮT BUỘC
          yAxisSuffix="%"
          segments={5}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            barPercentage: 0.5,
            color: (opacity = 1) => `rgba(33,150,243,${opacity})`,
            labelColor: () => "#333",
            propsForBackgroundLines: {
              stroke: "#eee",
            },
          }}
          style={{ borderRadius: 12 } as any }
        />
      </View>

      {/* ===== HISTORY LIST ===== */}
      <FlatList
        data={[...histories].reverse()} // mới nhất lên đầu
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 } as any}
        renderItem={({ item, index }) => {
          const date = new Date(item.answeredAt).toLocaleString("vi-VN");
          return (
            <View style={styles.card}>
              <Text style={styles.attempt}>
                Attempt #{histories.length - index}
              </Text>
              <Text style={styles.text}>📅 {date}</Text>
              <Text style={styles.text}>Score: {item.score}</Text>
              <Text style={styles.text}>
                Percent: {Math.min(item.percent, 100)}%
              </Text>
            </View>
          );
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("QuizTopic")}
      >
        <Text style={styles.buttonText}>⬅ Back to Quiz Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f7fb",
  },
  loading: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    elevation: 3,
  },
  chartTitle: {
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  attempt: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: "#444",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
