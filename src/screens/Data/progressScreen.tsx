import { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { fetchProgressApi } from "../../services/api/progress.services";
import { progress } from "../../models/progress";

interface ProgressProps {
  userId: string;
}

const screenWidth = Dimensions.get("window").width;

const Progress = ({ userId }: ProgressProps) => {
  const [progressData, setProgressData] = useState<progress[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProgressApi(userId)
      .then((data) => setProgressData(data.data))
      .catch(() => setProgressData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Đang tải tiến độ...</Text>
      </View>
    );

  if (!progressData || progressData.length === 0) {
    return <Text>Chưa có dữ liệu tiến độ</Text>;
  }

  const labels = progressData.map((item, i) => `L${i + 1}`);
  const scores = progressData.map((item) => item.score);

  return (
    <ScrollView>
      <Text style={styles.title}>Tiến độ học tập</Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: scores }],
        }}
        width={screenWidth - 40}
        height={220}
        fromZero
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#f5f5f5",
          backgroundGradientTo: "#e8e8e8",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
          style: { borderRadius: 16 },
        }}
        style={styles.chart}
      />

      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setDetailVisible(!detailVisible)}
      >
        <Text style={styles.toggleBtnText}>
          {detailVisible ? "Ẩn chi tiết" : "Xem chi tiết"}
        </Text>
      </TouchableOpacity>

      {detailVisible && (
        <View style={{ marginTop: 10 } as any}>
          {progressData.map((item) => (
            <View key={item._id} style={styles.detailCard}>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Status:</Text> {item.status}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Score:</Text> {item.score}
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.bold}>Cập nhật:</Text>{" "}
                {new Date(item.lastAccessedAt).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default Progress;

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: "center",
  },
  toggleBtn: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
    minWidth: 120,
    alignItems: "center",
  },
  toggleBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  detailCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 2,
  },
  bold: {
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
